# Arquitectura del prototipo

Lingora es un monolito servido por FastAPI. El navegador descarga la interfaz existente desde el mismo origen que la API. Python gestiona autenticación, datos, reglas de aprendizaje y llamadas a Gemini; DATABASE_URL activa PostgreSQL en el esquema privado lingora; sin ella SQLite guarda el estado local.

React y TypeScript se conservan para mantener las pantallas, estilos, accesibilidad, navegación y grabación de audio. Node/Vite se usan en la compilación, no como servidor de aplicación desplegado. FastAPI sirve `front/dist/index.html` y `front/dist/assets/` mediante archivos estáticos; documentación de referencia: https://fastapi.tiangolo.com/tutorial/static-files/.

## Módulos

- `back/main.py`: rutas, validación, protección de origen, límite de cuerpo y entrega de interfaz.
- `back/auth.py`: contraseñas PBKDF2 con sal aleatoria, sesiones en cookies HttpOnly, recuperación SMTP y tokens de un solo uso.
- `back/storage.py`: PostgreSQL/SQLite, transacciones y registros por usuario.
- `back/learning.py`: corrección, avance, repasos SM-2 y diagnóstico con límite de 900 segundos.
- `back/ai.py`: Gemini, contexto breve, límites de salida, reservas de cuota, caché, historial y consumo.
- `back/curriculum.json`: catálogo exportado desde `front/src/data/curriculum.ts` durante la compilación.
- `front/src/lib/db.ts`: cliente HTTP del mismo origen y notificación de cambios de sesión; ya no usa Supabase.
- `front/src/lib/useLearner.ts`: estado y actualización del alumno desde `/api/learner`.

## Consistencia

Cada escritura educativa usa `BEGIN IMMEDIATE` y verifica la versión recibida antes de modificar el estado. Un envío obsoleto recibe 409; no duplica respuestas. El diagnóstico cobra como máximo 45 segundos desde el último contacto cuando estaba activo, y nunca supera 900 segundos. Las pausas explícitas detienen el tiempo.

Las reservas de IA se confirman antes de contactar al proveedor. El acceso a la red ocurre fuera de la transacción. Las explicaciones se cachean por usuario durante siete días; mensajes y audio no son instrucciones del sistema. El audio no se persiste.

El tutor tiene alcance exclusivo de aprendizaje de inglés, también para escritura, explicaciones y audio. Permite traducción, corrección y conversaciones explícitas de práctica; escribir una petición ajena en inglés no la habilita. Gemini devuelve `in_scope` y `text` en JSON; Python valida tipos estrictos y sustituye decisiones negativas por «No puedo ayudarte con eso. Solo puedo ayudarte a aprender y practicar inglés.». No publica respuestas mal formadas. La política tiene versión propia para invalidar caché antigua y no cachea rechazos. La clasificación semántica depende del modelo y debe evaluarse con casos reales; no constituye una garantía absoluta frente a todos los intentos de manipulación.

Esta comprobación comparte la misma llamada al proveedor, con 80 tokens adicionales de margen para el formato JSON. Las consultas rechazadas siguen consumiendo la reserva de cuota. Referencia del formato: [salidas estructuradas de Gemini](https://ai.google.dev/gemini-api/docs/structured-output).

## Alcance operativo

El glosario propio vive en `front/src/data/glossary.ts` y se incluye en el JavaScript compilado. `GlossaryView` presenta secciones y resultados filtrados localmente. No tiene tablas, endpoints ni consultas IA y no sustituye `back/curriculum.json`: las lecciones guardadas conservan sus identificadores y contenido. Tampoco amplía automáticamente el contexto del tutor. El contenido original del glosario puede consultarse aunque el diccionario externo no esté disponible.

Cambridge Dictionary se integra únicamente mediante enlaces en el vocabulario. `front/src/lib/dictionary.ts` construye consultas inglés-español con `URLSearchParams`, preservando expresiones completas y codificando caracteres especiales. El navegador abre una pestaña nueva con `noopener noreferrer`; no se envía información de la cuenta. No se descargan ni guardan definiciones, ejemplos o audio, y Gemini no obtiene herramientas de Cambridge. LINGORA no se presenta como producto asociado u oficial.

La guía reutilizable de desarrollo está en [la skill lingora-cambridge](skills/lingora-cambridge/SKILL.md). Para cualquier futura API deben verificarse previamente la documentación y las condiciones oficiales enlazadas allí. Cambridge puede cambiar su búsqueda, mostrar sugerencias o bloquear accesos automatizados; las pruebas locales verifican la construcción y presentación de enlaces, no garantizan disponibilidad ni cobertura del sitio externo.

Diseñado para un prototipo pequeño. PostgreSQL serializa las transacciones mediante un advisory lock por esquema para preservar cuotas y consistencia; puede limitar el rendimiento con alta concurrencia. No es una migración automática de datos de Supabase. Para un despliegue público hace falta configurar HTTPS, correos invitados, SMTP y respaldos, y revisar límites de acceso y operación para el alojamiento elegido.

La implementación anterior se conserva como referencia y no se carga en el servidor FastAPI. Véase `legacy/`.
