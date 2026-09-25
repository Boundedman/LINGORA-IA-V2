"""One-time, all-or-nothing SQLite import into an empty private PostgreSQL schema.

Stop FastAPI before running: node scripts/python.mjs -m scripts.migrate_sqlite
"""
import os
import sqlite3
from datetime import datetime, timezone
from dotenv import load_dotenv
from back.storage import ROOT, database, initialize, storage_backend, sync_profile_names


def main():
    load_dotenv(ROOT / '.env')
    if storage_backend() != 'postgresql':
        raise RuntimeError('Configure DATABASE_URL first')
    source = ROOT / os.getenv('DATABASE_PATH', 'data/lingora.sqlite3')
    if not source.is_file():
        raise RuntimeError('SQLite source does not exist')
    backup = ROOT / 'data' / ('before-supabase-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f') + '.sqlite3')
    with sqlite3.connect(source.as_uri() + '?mode=ro', uri=True) as original:
        with sqlite3.connect(backup) as dest:
            original.backup(dest)
    tables = {
        'users': ('id', 'email', 'password'),
        'sessions': ('token', 'user_id', 'expires'),
        'resets': ('token', 'user_id', 'expires'),
        'records': ('kind', 'user_id', 'id', 'payload'),
    }
    initialize()
    with sqlite3.connect(backup.as_uri() + '?mode=ro', uri=True) as src, database() as target:
        if 'display_name' in [row[1] for row in src.execute('PRAGMA table_info(users)')]:
            tables['users'] = ('id', 'email', 'password', 'display_name')
        for table in tables:
            if target.execute(f'SELECT 1 FROM {table} LIMIT 1').fetchone():
                raise RuntimeError('Target is not empty; import cancelled without overwriting data')
        for table, columns in tables.items():
            fields = ','.join(columns)
            records = src.execute(f'SELECT {fields} FROM {table} ORDER BY rowid').fetchall()
            placeholders = ','.join('?' for _ in columns)
            for record in records:
                target.execute(f'INSERT INTO {table} ({fields}) VALUES ({placeholders})', record)
            actual = [tuple(row[column] for column in columns) for row in target.execute(f'SELECT {fields} FROM {table}')]
            if set(actual) != set(records):
                raise RuntimeError('Verification failed; transaction rolled back')
            print(f'{table}: {len(records)} verified')
        sync_profile_names(target)
    print('Import committed. SQLite source and backup preserved in data/.')


if __name__ == '__main__':
    main()
