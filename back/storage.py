"""Transactional storage: private PostgreSQL schema or local SQLite."""
import json
import os
import sqlite3
import re
from contextlib import contextmanager
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def storage_backend():
    return 'postgresql' if os.getenv('DATABASE_URL') else 'sqlite'

def schema_name():
    name = os.getenv('DATABASE_SCHEMA', 'lingora')
    if not re.fullmatch(r'lingora(?:_[a-z0-9_]+)?', name):
        raise ValueError('DATABASE_SCHEMA must be lingora or lingora_<suffix>')
    return name

class Record(dict):
    def __getitem__(self, key):
        return tuple(self.values())[key] if isinstance(key, int) else super().__getitem__(key)

def record_factory(cursor):
    names = [column.name for column in cursor.description] if cursor.description else []
    return lambda values: Record(zip(names, values))

class PostgresConnection:
    """Translate the application's fixed SQL templates, never user-supplied SQL."""
    def __init__(self, conn):
        self.conn = conn

    def execute(self, query, params=None):
        query = query.replace('ORDER BY rowid', 'ORDER BY ordinal')
        return self.conn.execute(query.replace('?', '%s'), params)

    def executescript(self, script):
        for statement in script.split(';'):
            if statement.strip():
                self.conn.execute(statement)

@contextmanager
def database():
    if storage_backend() == 'postgresql':
        import psycopg
        from psycopg import sql
        with psycopg.connect(os.environ['DATABASE_URL'], connect_timeout=10,
                             sslmode='require', row_factory=record_factory) as conn:
            conn.execute(sql.SQL('SET LOCAL search_path TO {}').format(sql.Identifier(schema_name())))
            conn.execute("SET LOCAL statement_timeout = '30s'")
            # Preserve SQLite's serialized transactions, including quota reservations.
            conn.execute('SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))', (schema_name(),))
            yield PostgresConnection(conn)
        return
    path = Path(os.getenv("DATABASE_PATH", str(ROOT / "data/lingora.sqlite3")))
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        conn.execute("BEGIN IMMEDIATE")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def initialize():
    with database() as conn:
        postgres = storage_backend() == 'postgresql'
        if postgres:
            # Use the same schema as manual installation, inside our transaction.
            script = (ROOT / 'back/schema.sql').read_text(encoding='utf-8')
            script = '\n'.join(line for line in script.splitlines() if line.strip() not in ('BEGIN;', 'COMMIT;'))
            script = re.sub(r'\blingora\b', schema_name(), script)
            conn.conn.execute(script, prepare=False)
            return
        ddl = '''
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
          display_name TEXT NOT NULL DEFAULT '');
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS resets (
          token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS records (
          kind TEXT NOT NULL, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          id TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(kind,user_id,id));
        '''
        conn.executescript(ddl)
        if 'display_name' not in [row['name'] for row in conn.execute('PRAGMA table_info(users)')]:
            conn.execute("ALTER TABLE users ADD COLUMN display_name TEXT NOT NULL DEFAULT ''")
        sync_profile_names(conn)

def sync_profile_names(conn):
    for row in conn.execute("SELECT user_id, payload FROM records WHERE kind='profiles' AND id=user_id"):
        profile = json.loads(row['payload'])
        conn.execute('UPDATE users SET display_name=? WHERE id=?',
                     (profile.get('display_name') or '', row['user_id']))

def rows(conn, kind, uid):
    return [json.loads(r[0]) for r in conn.execute(
        "SELECT payload FROM records WHERE kind=? AND user_id=? ORDER BY rowid", (kind, uid))]

def get(conn, kind, uid, key):
    row = conn.execute("SELECT payload FROM records WHERE kind=? AND user_id=? AND id=?",
                       (kind, uid, key)).fetchone()
    return json.loads(row[0]) if row else None

def put(conn, kind, uid, key, value):
    conn.execute("INSERT INTO records (kind,user_id,id,payload) VALUES(?,?,?,?) ON CONFLICT(kind,user_id,id) DO UPDATE SET payload=excluded.payload",
                 (kind, uid, key, json.dumps(value, ensure_ascii=False)))
    if kind == 'profiles' and key == uid:
        conn.execute('UPDATE users SET display_name=? WHERE id=?',
                     (value.get('display_name') or '', uid))
    return value
