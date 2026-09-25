# Tipos y aprendizaje

- `types.ts`: niveles, habilidades, ejercicios, lecciones, perfil, progreso, repasos y diagnóstico.
- `learning.ts`: normalización de respuestas, siguiente lección, SM-2, evidencia por habilidad y tiempo restante.
- `glossary.ts`: búsqueda local sin distinción de mayúsculas o acentos y filtros combinados por nivel y sección. Busca en términos, traducciones, notas y ejemplos sin acceder a servicios externos.

Son funciones independientes de React, verificadas en `front/tests/learning.test.ts`. Ayudan a presentar datos y practicar sin cuenta. La autoridad para guardar respuestas, avances y fechas es `back/learning.py`; revisa ambos lados al modificar reglas compartidas.
