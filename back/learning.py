import math
import re
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from .storage import get, put, rows

def now():
    return datetime.now(timezone.utc)

def normalize(text):
    return re.sub(r"\s+", " ", re.sub(r"[.!?]+$", "", text.strip().lower().replace("’", "'").replace("‘", "'")))

def check_version(record, version):
    if record["version"] != version:
        raise HTTPException(409, "CONFLICT: recarga los datos antes de continuar.")

def add_review(conn, uid, front, back):
    if any(r["front"] == front for r in rows(conn, "reviews", uid)):
        return
    key = str(uuid.uuid4())
    put(conn, "reviews", uid, key, dict(id=key, front=front, back=back,
        next_review=now().isoformat(), interval_days=0, ease=2.5, repetitions=0, version=0))

def submit(conn, uid, body, lessons):
    lesson = next((l for l in lessons if l["id"] == body.p_lesson), None)
    if not lesson:
        raise HTTPException(404, "Lección no disponible.")
    p = get(conn, "lesson_progress", uid, body.p_lesson) or dict(
        lesson_id=body.p_lesson, step=0, completed=False, correct=0, attempts=0, version=0)
    check_version(p, body.p_version)
    if p["completed"]:
        raise HTTPException(409, "Lección ya completada.")
    exercise = lesson["exercises"][p["step"]]
    expected = exercise.get("answer")
    correct = normalize(body.p_answer) == normalize(expected) if expected is not None else None
    key = f'{lesson["id"]}:{exercise["id"]}'
    put(conn, "exercise_attempts", uid, key, dict(lesson_id=lesson["id"], exercise_id=exercise["id"],
        answer=body.p_answer, correct=correct, created_at=now().isoformat()))
    if correct is False:
        put(conn, "user_errors", uid, key, dict(original=body.p_answer, correction=expected,
            explanation=exercise["explanation"], last_occurrence=now().isoformat()))
        add_review(conn, uid, exercise["prompt"], expected + " — " + exercise["explanation"])
    p.update(step=p["step"]+1, correct=p["correct"]+int(correct is True),
             attempts=p["attempts"]+int(correct is not None), version=p["version"]+1)
    p["completed"] = p["step"] >= len(lesson["exercises"])
    if p["completed"]:
        for word in lesson["vocabulary"]:
            add_review(conn, uid, word["word"], word["translation"])
    put(conn, "lesson_progress", uid, lesson["id"], p)
    return dict(progress=p, correct=correct, explanation=exercise["explanation"], answer=expected)

def rate(conn, uid, body):
    r = get(conn, "reviews", uid, body.p_id)
    if not r:
        raise HTTPException(404, "Repaso no disponible.")
    check_version(r, body.p_version)
    if datetime.fromisoformat(r["next_review"]) > now():
        raise HTTPException(409, "Repaso aún no disponible.")
    q = body.p_quality
    days = 1 if q < 3 or r["repetitions"] == 0 else 6 if r["repetitions"] == 1 else max(1, math.floor(r["interval_days"]*r["ease"]+0.5))
    r.update(interval_days=days, ease=max(1.3, r["ease"]+0.1-(5-q)*(0.08+(5-q)*0.02)),
             repetitions=0 if q < 3 else r["repetitions"]+1,
             next_review=(now()+timedelta(days=days)).isoformat(), version=r["version"]+1)
    return put(conn, "reviews", uid, r["id"], r)

def diagnostic(conn, uid, body):
    d = get(conn, "diagnostics", uid, uid) or dict(id=str(uuid.uuid4()), answers={},
        elapsed_seconds=0, active=False, completed=False, version=0, updated_at=now().isoformat())
    check_version(d, body.p_version)
    if d["completed"]:
        return d
    elapsed = min(900, d["elapsed_seconds"] + (min(45, max(0, (now()-datetime.fromisoformat(d["updated_at"])).total_seconds())) if d["active"] else 0))
    if body.p_key is not None and elapsed < 900:
        if body.p_answer is None:
            raise HTTPException(422, "Falta la respuesta.")
        d["answers"][body.p_key] = body.p_answer
    d.update(elapsed_seconds=elapsed, active=body.p_active and elapsed < 900 and not body.p_finish,
             completed=body.p_finish or elapsed >= 900, version=d["version"]+1, updated_at=now().isoformat())
    return put(conn, "diagnostics", uid, uid, d)
