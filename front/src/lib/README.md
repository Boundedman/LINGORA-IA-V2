# Cliente y estado

- `db.ts`: `api()` envía JSON del mismo origen con la cookie de sesión, adapta errores y ofrece autenticación y RPC. El nombre `db` se conserva como interfaz local, pero ya no representa Supabase ni acceso directo a SQLite.
- `useLearner.ts`: carga sesión, perfil, catálogo, progreso, repasos y diagnóstico; refresca después de acciones y al recuperar el foco de la ventana.
- `dictionary.ts`: construye consultas al diccionario inglés-español de Cambridge mediante URLSearchParams, conservando expresiones y codificando puntuación. Solo crea enlaces externos; no consulta una API ni envía datos de cuenta.

Los componentes usan estas funciones para comunicarse con `/api/*`. FastAPI identifica al usuario mediante una cookie HttpOnly; JavaScript no necesita leer el token. No introduzcas claves de proveedor en esta carpeta.

`useLearner` incluye avatar y descarta respuestas de cuentas anteriores al cambiar de sesión. Las fotos llegan desde la API autenticada; no se usan enlaces públicos de Supabase Storage.
