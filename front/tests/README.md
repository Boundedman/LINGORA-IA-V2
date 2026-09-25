# Pruebas de frontend

- `learning.test.ts`: normalización, repasos, siguiente lección, diagnóstico y cobertura del catálogo.
- `dictionary.test.ts`: consultas de Cambridge para palabras, expresiones y puntuación, origen fijo y cobertura de todo el vocabulario de las 28 lecciones.
- `glossary.test.ts`: cobertura de los términos de las lecciones, entradas completas y sin duplicados, búsqueda bilingüe con acentos y filtros combinados. La prueba de interfaz comprueba acceso anónimo, contenido local, búsqueda, resultado vacío, limpieza y selección temática.
- `ui.test.ts`: JSDOM y React Testing Library comprueban práctica, filtros y acceso al diagnóstico. Simula una sesión anónima; no consulta al proveedor.

Ejecuta `npm test` desde la raíz y `npm run lint` para tipos. Complementan `back/tests/`; no sustituyen pruebas de micrófono, SMTP o Gemini reales. Las del antiguo proveedor TypeScript están en `legacy/tests/`.

La prueba de interfaz también abre el vocabulario y comprueba texto, ubicación y atributos de los enlaces Cambridge. No consulta el sitio externo durante los tests.

Las pruebas de interfaz también cubren registro con nombre y avatar por defecto, carga/eliminación de foto y cambio de cuenta con una respuesta anterior retrasada.
