"""Read-only connection check; never print the connection string or errors containing it."""
import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


def main():
    load_dotenv(Path(__file__).resolve().parents[1] / '.env')
    url = os.getenv('DATABASE_URL', '')
    if not url or '[YOUR-PASSWORD]' in url:
        print('Falta completar DATABASE_URL en el .env de la raiz.')
        return 1
    try:
        with psycopg.connect(url, connect_timeout=10, sslmode='require') as conn:
            conn.execute('SET TRANSACTION READ ONLY')
            conn.execute('SELECT 1').fetchone()
            count = conn.execute(
                "SELECT count(*) FROM information_schema.tables "
                "WHERE table_schema IN ('public', 'lingora')"
            ).fetchone()[0]
            print(f'Conexion correcta. Tablas visibles en public/lingora: {count}.')
        return 0
    except (psycopg.Error, ValueError) as exc:
        if 'password authentication failed' in str(exc).lower():
            print('Supabase rechazo la autenticacion. Revisa usuario y contrasena de la base de datos y su codificacion URL.')
        else:
            print('No se pudo conectar. Revisa DATABASE_URL, disponibilidad del proyecto y acceso de red.')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
