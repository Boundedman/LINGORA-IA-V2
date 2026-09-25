# Contenido educativo

- `curriculum.ts`: genera 28 lecciones originales, ejemplos, vocabulario y ejercicios A1–B2, y descripciones de niveles.
- `assessment.ts`: banco y selección de preguntas del diagnóstico según respuestas anteriores.
- `glossary.ts`: glosario original de LINGORA con 64 entradas en 8 secciones. Incluye las 16 palabras distintas que ya usan las lecciones y 48 términos adicionales. Cada entrada contiene traducción, nivel orientativo, categoría gramatical, nota de uso, ejemplo propio y traducción del ejemplo. Cada sección propone una práctica libre.

La interfaz importa estos datos. `scripts/export-curriculum.ts`, ejecutado por `npm run build` desde la raíz, genera la copia JSON que lee Python. Después de cambiar contenido, compila y reinicia FastAPI.

Conserva los identificadores de actividades con progreso guardado; los cambios incompatibles necesitan nuevos identificadores o migración explícita. El catálogo es una muestra del piloto, no un curso exhaustivo ni una certificación.

El glosario se compila en la interfaz y no se exporta al catálogo de lecciones de Python. Sus entradas son de consulta: no crean ejercicios evaluados, repasos ni progreso. No contiene definiciones o ejemplos descargados de Cambridge. Al ampliarlo, revisa acepciones, contabilidad y combinaciones habituales; los niveles son decisiones editoriales de práctica. Las filas de datos usan el orden término, traducción, nivel, categoría, uso, ejemplo y traducción del ejemplo.
