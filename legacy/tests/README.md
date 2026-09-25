# Pruebas históricas

- `provider.test.ts`: simula Gemini y comprueba presupuesto, exclusión de pensamientos internos, errores y métodos HTTP.
- `context.test.ts`: comprueba tamaño de contexto y validación del adaptador TypeScript.

Desde la raíz ejecuta `npm run test:legacy`. No requiere claves ni llama a servicios reales. Se separaron de `front/tests/` para distinguir código vigente y archivado; la IA actual se prueba en `back/tests/`.
