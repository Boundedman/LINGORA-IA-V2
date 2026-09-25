# Preparar Lingora con FastAPI

## 1. Requisitos e instalación

Usa Python 3.11 o superior y Node.js 22.12 o superior (Node solo para compilar o editar la interfaz). Ejecuta desde la raíz del proyecto, en PowerShell:

```powershell
py -m venv .venv
.venv\Scripts\python.exe -m pip install -r back/requirements.txt
npm ci
npm run build
```

Si Windows no encuentra `python`, utiliza `py`. Si `venv` falla al instalar pip, completa el entorno con `py -m pip --python .venv/Scripts/python.exe install -r back/requirements.txt`.

La instalación de esta sesión ya creó `.venv` e instaló las dependencias. `back/requirements.lock.txt` conserva las versiones verificadas; puedes usarlo en lugar de `back/requirements.txt` para reproducirlas.

## 2. Iniciar el monolito

```powershell
.venv\Scripts\python.exe -m uvicorn back.main:app --host 127.0.0.1 --port 8000
```

Abre **http://127.0.0.1:8000**. API interactiva: http://127.0.0.1:8000/docs. Detén el proceso con Ctrl+C. También puedes usar `npm start` después de compilar o `npm run dev` para compilar e iniciar.

En Linux/macOS, crea el entorno con `python3 -m venv .venv` y usa `.venv/bin/python`. Los comandos npm de arranque seleccionan el ejecutable apropiado.

Sin DATABASE_URL, SQLite crea `data/lingora.sqlite3` automáticamente. Con DATABASE_URL se usa PostgreSQL de Supabase (ver DATABASE.md). Crea una cuenta desde la interfaz y guarda tu perfil. No hay credenciales predeterminadas. El catálogo del servidor ya está incluido en `back/curriculum.json`; `npm run build` lo regenera desde el contenido original.

## 3. Configuración opcional

Copia `.env.example` a `.env` solamente si todavía no tienes un `.env`. La conexión PostgreSQL usa DATABASE_URL; las antiguas claves de la API JavaScript no se utilizan. Nunca publiques claves ni el archivo de SQLite.

- `DATABASE_PATH`: ruta del archivo SQLite. Por defecto se resuelve en la raíz del proyecto; si configuras una ruta relativa, se interpreta desde el directorio de arranque.
- `PILOT_INVITES`: correos separados por comas. Vacío permite registro local; complétalo para restringir el grupo del piloto.
- `APP_URL`: URL pública utilizada en enlaces de recuperación.
- `COOKIE_SECURE`: `false` para HTTP local; `true` al servir con HTTPS.
- `AI_ENABLED`, `AI_PROVIDER=gemini`, `AI_MODEL`, `AI_API_KEY`: habilitan el tutor. Elige un modelo disponible en tu cuenta que admita las operaciones que vas a usar.
- `AI_DAILY_CALLS_PER_USER`, `AI_DAILY_CALLS_GLOBAL`, `AI_MAX_CALLS_PER_MINUTE`: cuotas; valores predeterminados 20, 100 y 4. Fallos y caché también consumen reserva.
- `AI_PRICE_CONFIGURED`, `AI_INPUT_COST_PER_MILLION`, `AI_OUTPUT_COST_PER_MILLION`: estimación opcional, no un límite monetario.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_USER`, `SMTP_PASSWORD`: recuperación de contraseña con STARTTLS. Sin SMTP se muestra un mensaje explícito; no se simula el envío.

Reinicia FastAPI después de cambiar `.env`. El registro local inicia sesión directamente; no exige confirmar correo. Se mantiene la confirmación de mayoría de edad en la interfaz.

## 4. Desarrollar sin recompilar cada cambio visual

En una terminal: `npm run dev:api`. En otra: `npm run dev:ui`. Abre http://127.0.0.1:5173; Vite redirige `/api` hacia FastAPI en el puerto 8000. Estos dos procesos son herramientas de desarrollo; la aplicación compilada se sirve desde un único proceso Python.

Al cambiar el catálogo, ejecuta `npm run build` y reinicia FastAPI. No edites directamente `back/curriculum.json` ni `front/dist/`.

## 5. Verificar

```powershell
npm run build
npm test
npm run test:backend
```

Las pruebas Python usan bases temporales y un proveedor simulado; no llaman a Gemini ni envían correo. Comprueban sesiones, aislamiento, progreso, conflictos, repasos, diagnóstico, recuperación, cuotas, caché y eliminación. La API real de IA, el envío SMTP y el micrófono necesitan pruebas con su configuración real.

## 6. Probar desde otros dispositivos

Inicia con `--host 0.0.0.0` y accede desde la misma red a la IP de esta computadora, puerto 8000. Usa siempre la misma instancia y cuenta para compartir progreso. El micrófono fuera de localhost requiere HTTPS. Para publicar el piloto, usa un alojamiento que ejecute Python, HTTPS y disco persistente; la configuración antigua de Netlify no sirve este monolito.

Para respaldar, detén el servidor y copia `data/lingora.sqlite3` a una ubicación segura. Para restaurar, detén el servidor y repón ese archivo. Evita sincronizar o editar la base abierta desde varias computadoras. Los datos existentes en un Supabase externo no se importan automáticamente.
