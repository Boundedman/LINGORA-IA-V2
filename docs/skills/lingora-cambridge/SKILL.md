---
name: lingora-cambridge
description: Integrar enlaces de Cambridge Dictionary y revisar vocabulario de LINGORA para crear explicaciones y ejercicios originales A1–B2. Usar al trabajar en este recurso de apoyo; no implica acceso del tutor a Cambridge ni autorización para importar datos.
---

# Cambridge como apoyo de LINGORA

Revisa primero las instrucciones del proyecto, su estructura y la bitácora. En el monolito actual, el contenido está en `front/src/data/curriculum.ts`, la vista en `front/src/components/LessonView.tsx` y el constructor de enlaces en `front/src/lib/dictionary.ts`. Confirma estas rutas antes de editar; no supongas que todas las copias del proyecto tienen la misma estructura.

## Referencia y autoría

- Consulta [Cambridge Dictionary en español](https://dictionary.cambridge.org/es/) y su diccionario inglés-español para revisar significado, categoría gramatical, colocaciones, uso y variantes de una palabra o expresión concreta. Distingue las acepciones según el contexto de la lección.
- Escribe explicaciones, ejemplos y ejercicios originales; no traduzcas ni parafrasees mecánicamente entradas enteras. Para A1–A2 usa situaciones cotidianas, frases breves y apoyo en español; para B1–B2 añade contexto, matices y producción más independiente. Verifica que las respuestas y distractores sean adecuados al objetivo, sin atribuir una certificación de nivel a Cambridge.
- Registra qué entradas consultaste cuando revises contenido. Si el sitio no puede consultarse, indícalo; no inventes definiciones ni afirmes una revisión que no realizaste. No amplíes el catálogo ni cambies identificadores de actividades sin que la tarea lo requiera.

## Enlaces en la aplicación

- Reutiliza `cambridgeEnglishSpanishUrl()`; no dupliques lógica en componentes. Construye consultas HTTPS al dominio fijo `dictionary.cambridge.org`, con `datasetsearch=english-spanish` y `q` mediante `URL`/`URLSearchParams`. Conserva palabras y expresiones completas; no inventes slugs eliminando puntuación. La ruta de consulta utilizada es `/es/search/direct/`; verifica su vigencia si cambia el sitio.
- Usa enlaces normales con texto «Consultar en Cambridge», `target="_blank"` y `rel="noopener noreferrer"`. Identifica la palabra y la apertura en otra pestaña de forma accesible. No envíes claves, mensajes del alumno, identificadores ni datos personales: solo el término público del catálogo.
- Explica brevemente que es un recurso externo para consultar significados y pronunciación. No uses logos ni presentes LINGORA como producto oficial, patrocinado o asociado a Cambridge.
- Verifica términos simples y expresiones, codificación de caracteres, atributos de seguridad y presentación en el vocabulario. Si una entrada no existe, la consulta puede mostrar sugerencias; no prometas cobertura total.

## Límites de integración

La skill guía al agente de desarrollo. Instalarla no añade herramientas ni navegación al tutor Gemini. Los enlaces solo llevan al navegador del alumno a Cambridge; no implementes scraping, iframes, descarga de audio, caché de definiciones ni nuevas llamadas desde el backend si la tarea se resuelve con enlaces.

No copies masivamente definiciones, ejemplos, bases de datos ni audios, ni incorpores contenido protegido al catálogo o al contexto del tutor sin derechos comprobados. Una futura API exige revisar la [documentación oficial](https://dictionary-api.cambridge.org/api/), su [especificación](https://dictionary-api.cambridge.org/api/specification), las [preguntas frecuentes](https://dictionary-api.cambridge.org/api/faq) y las condiciones oficiales enlazadas allí. Comprueba licencia, atribución, almacenamiento, cuotas, costo y usos permitidos vigentes antes de diseñar esa integración; no supongas que el acceso web concede una licencia de reutilización.

## Entrega

Mantén diseño, progreso, datos personales, secretos y funcionamiento de Gemini fuera de cambios no solicitados. Ejecuta pruebas pertinentes y compilación; comprueba los enlaces renderizados y documenta cualquier límite de verificación externa. Actualiza la documentación y `BITACORA.md`, preservando historial y ocultando secretos.
