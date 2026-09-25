# Pruebas del backend

`test_app.py` ejecuta FastAPI con `TestClient` y SQLite temporal. Comprueba sesiones, aislamiento, eliminación, ejercicios, conflictos, concurrencia, repasos, diagnóstico, recuperación, invitaciones, validación, origen de peticiones y cuotas/historial de IA.

También comprueba que las cuatro operaciones IA sustituyan respuestas fuera de alcance por el rechazo fijo, que JSON inválido no se exponga y que no se reutilice caché de la política anterior. Los dobles del proveedor verifican el comportamiento del servidor; no demuestran por sí solos la clasificación semántica del modelo real.

Desde la raíz: `npm run test:backend` o `.venv\Scripts\python.exe -m pytest -c back/pytest.ini back/tests -q`. El proveedor se simula y no se envía correo real. La ubicación de SQLite se sobrescribe para no modificar cuentas reales. No incluyas secretos en fixtures. `__pycache__/` se regenera automáticamente.

Las pruebas eliminan DATABASE_URL de su entorno para no tocar la base configurada. Con TEST_DATABASE_URL ejecutan el mismo conjunto sobre esquemas PostgreSQL temporales lingora_test_<uuid>, eliminados al finalizar cada prueba.

También se verifica la recuperación del nombre desde perfiles anteriores, la conservación de hashes y avances tras actualizar el esquema dos veces, y el rollback conjunto de nombre y perfil.

Se comprueban nombre obligatorio, fotos inválidas sin creación parcial de cuenta, normalización a JPEG, persistencia tras login, aislamiento por usuario y eliminación de avatares.

El tutor responde con una redirección al aprendizaje cuando el proveedor devuelve contenido no validable o vacío, incluso después de guardar un interés. No expone ese contenido ni lo guarda como explicación en caché. Los fallos reales de conexión mantienen HTTP 503.
