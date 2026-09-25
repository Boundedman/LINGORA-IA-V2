# Lingora: guía completa del proyecto

Esta guía explica el código que existe en esta carpeta, cómo se conectan sus partes y qué falta para ponerlo en funcionamiento con usuarios reales. Describe la implementación local revisada; no acredita un despliegue ni una conexión con servicios externos.

## 1. Qué es Lingora

Lingora es una aplicación web para aprender y practicar inglés dirigida inicialmente a un piloto de 5–10 adultos hispanohablantes. Se puede abrir desde computadora o celular. Con Supabase configurado, la misma cuenta conserva su progreso entre dispositivos con conexión a internet.

Incluye una colección inicial de 28 lecciones: cuatro niveles, A1, A2, B1 y B2, con siete habilidades por nivel: vocabulario, gramática, lectura, escucha, escritura, expresión oral y pronunciación. Esta colección es un punto de partida, no un curso exhaustivo ni una certificación MCER (Marco Común Europeo de Referencia).

Las funciones principales son:

- Explorar y realizar lecciones con ejercicios cerrados y abiertos.
- Declarar el nivel y registrar un objetivo diario de práctica.
- Realizar un diagnóstico opcional y pausable de hasta 15 minutos activos.
- Guardar el interés principal desde el chat y usarlo como contexto del tutor.
- Practicar mediante un tutor de texto, cuando la IA esté configurada.
- Repasar vocabulario con repetición espaciada y consultar estadísticas de actividad.
- Gestionar la cuenta, exportar datos, borrar conversaciones y eliminar la cuenta.

No hay chat por voz. Las prácticas con micrófono y el feedback opcional del diagnóstico son funciones diferentes de una conversación de voz en tiempo real.

## 2. Qué agente usaremos en la aplicación

**La implementación actual está preparada para un tutor educativo propio de Lingora que utiliza Gemini como proveedor de IA. El modelo concreto todavía está pendiente de configurar en `AI_MODEL`.**

Conviene distinguir tres cosas:

- **Tutor Lingora:** comportamiento educativo definido por el proyecto. Explica, corrige y propone práctica adaptada al estudiante.
- **Gemini:** proveedor que genera las respuestas. El único adaptador implementado es `GeminiProvider`, en [server/ai.ts](server/ai.ts).
- **Modelo:** identificador específico que se coloca en `AI_MODEL`. El archivo de ejemplo lo deja vacío; el repositorio no selecciona automáticamente una versión ni un modelo de pago.

El tutor es un asistente conversacional con contexto limitado. No es un agente autónomo que ejecute herramientas, modifique cuentas o decida calificaciones oficiales. Tampoco hay un sistema de múltiples agentes ni integración de OpenAI o de un SDK de agentes en este código.

### Dónde se define y cómo se comporta

En `server/ai.ts`:

- `tutorPolicy` contiene las instrucciones del tutor: enseñar con explicaciones breves, una corrección prioritaria, un ejemplo y una pregunta útil; usar más español en A1/A2 y más inglés en B1/B2.
- `AIProvider` define el contrato que debe cumplir un proveedor: recibir instrucciones, mensaje, presupuesto de salida y audio opcional; devolver texto y consumo de tokens.
- `GeminiProvider.generate()` llama a la API del proveedor y aplica un tiempo máximo de espera de 25 segundos.
- `requestSchema` valida operaciones y tamaños de entrada mediante Zod.
- `retrieve()` busca contenido por coincidencia de palabras en el catálogo local; recupera hasta dos lecciones, o una lección por identificador. No usa embeddings ni una base vectorial.
- `buildContext()` reúne nivel, interés, hasta tres errores recientes y hasta seis mensajes recientes. Recorta el contexto para limitar su tamaño.
- `budgets` fija máximos de tokens de salida: 600 para conversación, 650 para escritura, 300 para explicación y 500 para audio. Un token es una unidad de texto utilizada por el modelo; no equivale necesariamente a una palabra.

En [netlify/functions/ai.ts](netlify/functions/ai.ts) se conecta todo: autenticación, validación, reserva de cuota, contexto, llamada al proveedor y registro del consumo.

### Qué envía la aplicación al proveedor

Envía la solicitud junto con el nivel, origen del nivel, interés, contenido educativo recuperado, errores recientes y mensajes recientes seleccionados. En una solicitud de feedback oral también envía el fragmento de audio. La aplicación no guarda ese audio en su base de datos; el tratamiento por parte del proveedor debe revisarse al configurar el servicio.

La interfaz carga hasta 30 mensajes para mostrar la conversación, pero el backend utiliza como máximo seis mensajes recientes para preparar una respuesta.

### Activación y decisiones pendientes

En `.env.example`, `AI_PROVIDER=gemini`, `AI_ENABLED=false` y tanto `AI_MODEL` como `AI_API_KEY` están vacíos. Por tanto, tener código del tutor no significa que la IA esté conectada.

Antes de activarla hay que elegir un modelo disponible y compatible con texto y, si se quiere feedback oral, con audio; verificar sus condiciones y costo; configurar la clave y establecer límites de uso. Esta guía describe el adaptador existente, sin hacer una recomendación de un modelo comercial concreto ni afirmar precios actuales.

Para cambiar de proveedor hay que implementar `AIProvider`, modificar la selección del proveedor en la función y añadir pruebas. Cambiar únicamente `AI_PROVIDER` a otro nombre no es suficiente.

## 3. Cómo se organiza la aplicación

La interfaz se ejecuta en el navegador con React y TypeScript. Vite inicia el entorno de desarrollo y genera los archivos estáticos de producción. Supabase proporciona autenticación y PostgreSQL. Las funciones de Netlify atienden las operaciones que necesitan secretos del servidor.

El recorrido de una conversación es:

1. El estudiante escribe en `Tutor.tsx`.
2. `src/lib/db.ts` envía un `POST /api/ai` con su token de sesión.
3. La función `netlify/functions/ai.ts` valida la identidad con `server/http.ts`.
4. PostgreSQL reserva la cuota mediante `reserve_ai`.
5. `server/ai.ts` prepara el contexto y llama a Gemini.
6. El servidor registra el resultado y, para conversación, guarda los mensajes.
7. React muestra la respuesta.

Las respuestas cerradas, el avance y los repasos se procesan mediante reglas de código y funciones SQL. No necesitan consumir IA.

## 4. Mapa de archivos: dónde está cada código

Las rutas siguientes son relativas a la raíz que contiene `package.json`. Los enlaces abren los archivos correspondientes.

### Entrada y pantallas

- [index.html](index.html): página HTML inicial con el elemento donde se monta React.
- [src/main.tsx](src/main.tsx): arranca React, carga los estilos y monta `App`.
- [src/App.tsx](src/App.tsx): estructura principal, navegación, inicio, catálogo, filtros, repasos, estadísticas y cuenta. También integra las pantallas de lecciones, diagnóstico y tutor. Varias pantallas están implementadas aquí mismo, no en archivos separados.
- [src/styles.css](src/styles.css): colores, tipografía, distribución, tarjetas, formularios y adaptación a distintos tamaños de pantalla.
- [src/components/Auth.tsx](src/components/Auth.tsx): ventana de acceso, registro por correo y contraseña, recuperación de contraseña y confirmación de mayoría de edad.
- [src/components/LessonView.tsx](src/components/LessonView.tsx): explicación de la lección, ejercicios, corrección, avance, feedback opcional de IA y reporte de problemas de contenido.
- [src/components/DiagnosticView.tsx](src/components/DiagnosticView.tsx): diagnóstico, pausas, reloj, guardado de respuestas, actividades abiertas y presentación de resultados orientativos.
- [src/components/Tutor.tsx](src/components/Tutor.tsx): chat de texto, carga del historial y captura o modificación del interés principal. Guardar el interés actualiza el perfil; no requiere una respuesta del modelo.
- [src/components/AudioPractice.tsx](src/components/AudioPractice.tsx): `Listen` reproduce texto con síntesis de voz del navegador; `AudioPractice` graba y reproduce audio local con un máximo de 40 segundos. El envío para evaluación está conectado en el diagnóstico; las lecciones orales permiten práctica local.

### Contenido y reglas de aprendizaje

- [src/data/curriculum.ts](src/data/curriculum.ts): contenido original, temas, vocabulario, explicaciones, ejemplos y ejercicios. Genera las 28 lecciones y expone las descripciones de niveles. Los identificadores siguen patrones como `a1-vocabulary`.
- [src/data/assessment.ts](src/data/assessment.ts): banco de preguntas derivado del catálogo y selección de preguntas del diagnóstico. Para cada una de cuatro habilidades cerradas comienza en A2 y después elige B2 si acierta o A1 si falla, con hasta dos preguntas por habilidad.
- [src/domain/types.ts](src/domain/types.ts): tipos compartidos para niveles, habilidades, ejercicios, lecciones, perfil, progreso, repasos y diagnóstico. Es el vocabulario de datos del proyecto.
- [src/domain/learning.ts](src/domain/learning.ts): normalización de respuestas, comparación, siguiente lección, cálculo SM-2 para repasos, estimación orientativa por habilidad y estadísticas. La escritura definitiva de progreso y repasos se realiza en SQL; al cambiar estas reglas hay que comprobar también su implementación en la migración.

### Sesión y conexión desde el navegador

- [src/lib/db.ts](src/lib/db.ts): crea el cliente público de Supabase cuando hay configuración; `requireDb()` exige una conexión disponible; `api()` envía solicitudes autenticadas a las funciones del servidor.
- [src/lib/useLearner.ts](src/lib/useLearner.ts): centraliza sesión, perfil, lecciones, progreso, repasos y diagnóstico. Carga los datos, permite actualizar el perfil y refresca la información al recuperar el foco de la ventana. Sin servicios utiliza el catálogo local para exploración.

La continuidad entre dispositivos depende de volver a leer datos guardados en Supabase. No hay aquí un sistema de colaboración en tiempo real ni persistencia offline del progreso.

### Backend y API

- [server/http.ts](server/http.ts): respuestas JSON, comprobación del token con Supabase y creación del cliente administrativo del servidor. Traduce fallos en respuestas públicas.
- [server/ai.ts](server/ai.ts): instrucciones del tutor, validación de entrada, recuperación de lecciones, contexto y adaptador Gemini.
- [netlify/functions/ai.ts](netlify/functions/ai.ts): endpoint `POST /api/ai`. Admite `tutor`, `writing`, `explain` y `audio`; controla cuotas, caché de explicaciones y registro del consumo.
- [netlify/functions/account.ts](netlify/functions/account.ts): endpoint `POST /api/account`. Admite `export`, `clear-history` y `delete`. La eliminación exige el texto `ELIMINAR`. La exportación incluye siete conjuntos de datos personales y limita cada consulta a 10 000 filas; no es un respaldo completo de toda la base de datos.

### Base de datos

- [supabase/migrations/001_initial.sql](supabase/migrations/001_initial.sql): crea tablas, restricciones, permisos, políticas de acceso y funciones transaccionales. Es una migración inicial; para modificaciones posteriores se deben crear nuevas migraciones.
- [scripts/seed.ts](scripts/seed.ts): importa el catálogo de `curriculum.ts` a Supabase con la clave de servicio. Actualiza por identificador, de modo que repetirlo puede sobrescribir ediciones manuales del contenido.

### Herramientas y pruebas

- [scripts/dev.ts](scripts/dev.ts): inicia una API local en el puerto 8787 y Vite en el mismo proceso de desarrollo; carga `.env` si existe.
- [scripts/test-db.ts](scripts/test-db.ts): ejecuta la migración en PostgreSQL embebido con PGlite y un esquema de autenticación simulado; comprueba aislamiento de datos, avances, conflictos, repasos, diagnóstico, cuotas y eliminación en cascada.
- [tests/learning.test.ts](tests/learning.test.ts): comprueba reglas educativas, catálogo, diagnóstico, límites de contexto y validación de solicitudes.
- [tests/provider.test.ts](tests/provider.test.ts): comprueba el adaptador con respuestas HTTP simuladas, límites de salida, errores y rechazo de métodos no admitidos. No valida una conexión real con Gemini.
- [tests/ui.test.ts](tests/ui.test.ts): comprueba exploración sin servicios, ejercicios, filtro de lecciones y solicitud de acceso al diagnóstico mediante React Testing Library y JSDOM.

### Configuración y dependencias

- [package.json](package.json): nombre, versión, dependencias, requisito de Node y comandos del proyecto.
- [package-lock.json](package-lock.json): fija las versiones resueltas de las dependencias y sus dependencias internas. Permite instalaciones reproducibles con `npm ci`. No contiene pantallas ni comportamiento del tutor; normalmente lo actualiza npm.
- [tsconfig.json](tsconfig.json): comprobación estricta de TypeScript para interfaz, backend, scripts y pruebas.
- [vite.config.ts](vite.config.ts): integración React, compilación y proxy local de `/api` hacia el puerto 8787.
- [netlify.toml](netlify.toml): comando de compilación, carpeta de salida, funciones, redirecciones y cabeceras de seguridad.
- [.env.example](.env.example): plantilla de variables públicas y privadas, con IA apagada por defecto.
- [.gitignore](.gitignore): excluye secretos locales, dependencias, cachés y resultados generados del control de versiones.

Las dependencias principales son React/React DOM para la interfaz, `@supabase/supabase-js` para datos y autenticación, Zod para validación y `lucide-react` para iconos. TypeScript, Vite y `tsx` sirven para desarrollo y compilación; PGlite, JSDOM y React Testing Library apoyan las pruebas.

### Carpetas generadas y carpeta anidada

- `node_modules/`: paquetes instalados; no es el lugar para modificar el código propio.
- `dist/`: salida generada por la compilación; los cambios se hacen en las fuentes y después se recompila.
- `.npm-cache/`: caché local de npm.
- `LINGORA_IA/`: en la inspección contiene `.git/` y `.gitattributes`, pero no las fuentes de la aplicación. El código descrito está en la carpeta padre. Antes de publicar en un repositorio hay que comprobar que se está versionando la raíz correcta.

## 5. Qué guarda la base de datos

La migración contiene estas tablas:

- `pilot_invites`: correos autorizados para registrarse en el piloto.
- `profiles`: nombre, nivel, origen del nivel, interés, minutos diarios y estado del registro inicial.
- `lessons`: catálogo educativo con contenido JSON y estado activo.
- `lesson_progress`: paso, finalización, aciertos, intentos evaluables y versión por usuario y lección.
- `exercise_attempts`: respuestas e información de corrección. Una respuesta abierta puede tener `correct=null` y no cuenta como acierto automático.
- `user_errors`: errores y explicaciones para reforzar el aprendizaje y contextualizar al tutor.
- `reviews`: tarjetas de vocabulario, próxima fecha y parámetros del repaso.
- `diagnostics`: respuestas, tiempo activo, versión y estado del diagnóstico.
- `messages`: mensajes de conversación del usuario y el tutor.
- `feedback`: reportes sobre contenido; no hay un panel administrativo de revisión implementado en las pantallas actuales.
- `ai_requests`: reservas, estado de llamadas, modelo, tokens, latencia y costo estimado opcional.
- `ai_cache`: explicaciones reutilizables con vencimiento, separadas por usuario.

Las funciones centrales son `create_profile` (perfil al registrarse), `submit_exercise` (corrección y avance), `rate_review` (programación del repaso), `save_diagnostic` (respuestas y reloj) y `reserve_ai` (reserva de uso del proveedor).

**RLS** significa seguridad por fila: restringe qué registros puede leer o modificar cada cuenta. Las funciones de progreso utilizan versiones y bloqueos para rechazar envíos obsoletos, por ejemplo cuando se intenta contestar el mismo paso desde dos dispositivos. El servidor utiliza una clave privilegiada y debe mantener sus comprobaciones explícitas de identidad y usuario.

## 6. Reglas y límites actuales

### Lecciones y progreso

Sin cuenta se puede practicar con estado temporal de la pantalla, pero ese avance no se convierte automáticamente en progreso persistente al registrarse. Con cuenta y base configurada, `submit_exercise` guarda cada respuesta y agrega vocabulario a los repasos al finalizar.

La siguiente lección prioriza una actividad comenzada; después busca una pendiente del nivel correspondiente. Aunque existe el campo `prerequisite`, las lecciones iniciales lo dejan en `null`. No hay una progresión curricular compleja implementada.

### Diagnóstico

Combina hasta ocho preguntas cerradas con actividades de escritura, expresión oral y pronunciación. Permite omitir actividades. Las habilidades abiertas no reciben un nivel automático validado y el diagnóstico no sustituye automáticamente el nivel declarado del perfil.

El servidor limita el total a 900 segundos. Durante la actividad la interfaz actualiza el servidor cada 15 segundos; el tiempo desde el último contacto se acota a 45 segundos. Un cierre abrupto puede consumir hasta ese margen adicional. Actualmente se conserva un diagnóstico por cuenta.

### Repasos

Utiliza SM-2 como base: la dificultad declarada al recordar una tarjeta determina el siguiente intervalo. No es FSRS. La preferencia de minutos diarios se muestra en la interfaz; no debe confundirse con un sistema completo de medición del tiempo estudiado.

### Audio

Listening utiliza las voces disponibles en el navegador. Las prácticas orales usan el micrófono y pueden escucharse localmente. El diagnóstico permite solicitar feedback de audio al proveedor. No existe análisis fonético preciso ni porcentaje validado de pronunciación.

### Cuotas y caché de IA

La plantilla define 20 llamadas diarias por usuario, 100 globales al día y 4 por minuto por usuario. La reserva se realiza antes de buscar caché; los aciertos de caché y los intentos fallidos también consumen la reserva. Las explicaciones se almacenan hasta siete días; las conversaciones no utilizan esa caché.

Los límites controlan solicitudes, no garantizan un importe monetario exacto. El costo registrado depende de las tarifas introducidas manualmente y solo se calcula si `AI_PRICE_CONFIGURED=true`.

## 7. Cómo ejecutar y configurar el proyecto

### Explorar localmente

El proyecto declara Node.js 22.12.0 o superior. Abre una terminal en la carpeta que contiene `package.json` y ejecuta:

```sh
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173`. La API local se inicia en `http://127.0.0.1:8787`. Sin variables de servicios se permite explorar contenido. Detén ambos procesos con Ctrl+C.

### Conectar Supabase

1. Crea el proyecto de Supabase y ejecuta la migración inicial una sola vez en una base nueva.
2. Copia `.env.example` a `.env` y completa las variables de Supabase.
3. Ejecuta `npm run seed` para cargar el catálogo.
4. Agrega los correos invitados a `pilot_invites` desde una sesión administrativa.
5. Configura autenticación por correo, confirmación, recuperación y URLs de retorno.
6. Reinicia el servidor local y comprueba registro, inicio de sesión y guardado.

Consulta los pasos y el ejemplo de invitación en [SETUP_GUIDE.md](SETUP_GUIDE.md).

### Variables de entorno

- `VITE_SUPABASE_URL`: URL pública usada por el navegador.
- `VITE_SUPABASE_ANON_KEY`: clave pública del cliente; su acceso queda limitado por los permisos y RLS.
- `SUPABASE_URL` y `SUPABASE_ANON_KEY`: configuración de Supabase para el servidor.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privilegiada exclusiva del servidor y del seed.
- `AI_PROVIDER`: proveedor implementado, `gemini`.
- `AI_MODEL`: identificador del modelo que se decida utilizar.
- `AI_API_KEY`: secreto de acceso al proveedor.
- `AI_ENABLED`: `true` permite llamadas si el resto está configurado; `false` las desactiva.
- `AI_DAILY_CALLS_PER_USER`, `AI_DAILY_CALLS_GLOBAL` y `AI_MAX_CALLS_PER_MINUTE`: cuotas de solicitudes.
- `AI_INPUT_COST_PER_MILLION` y `AI_OUTPUT_COST_PER_MILLION`: tarifas por millón de tokens para estimaciones.
- `AI_PRICE_CONFIGURED`: indica si se habilita el cálculo del costo estimado.

Todo lo que empieza con `VITE_` puede quedar incorporado al JavaScript público. Las claves de IA y de servicio de Supabase nunca deben llevar ese prefijo ni subirse al repositorio.

### Comandos disponibles

- `npm run dev`: interfaz y API local.
- `npm run dev:ui`: solo Vite; no inicia el backend local.
- `npm run build`: comprueba tipos y genera `dist/`.
- `npm run preview`: vista previa de los archivos compilados; no inicia las funciones de Netlify.
- `npm run lint`: comprobación de tipos de TypeScript; no hay un linter de estilo separado en este comando.
- `npm test`: pruebas de lógica, proveedor simulado e interfaz.
- `npm run test:db`: pruebas SQL con PGlite.
- `npm run seed`: carga o actualiza lecciones en el Supabase configurado; escribe datos reales.

### Desplegar

Netlify está previsto como alojamiento de la interfaz y las funciones. `netlify.toml` configura `npm run build`, salida `dist/` y redirección de `/api/*` a las funciones. Es necesario configurar las variables en el servicio y registrar el dominio final en Supabase Auth.

Publicar únicamente la carpeta `dist/` no instala por sí solo el backend. La existencia de `dist/` tampoco demuestra que haya un sitio desplegado. El objetivo es minimizar costos, pero la disponibilidad y las cuotas de los servicios deben verificarse al conectarlos.

## 8. Dónde modificar cada parte al continuar

- **Diseño, colores y adaptación móvil:** `src/styles.css`; estructura de pantallas en `src/App.tsx` y componentes.
- **Lecciones, ejemplos y vocabulario:** `src/data/curriculum.ts`; después revisar el seed. Para cambios incompatibles en lecciones ya contestadas, usar nuevos identificadores o implementar versionado editorial.
- **Diagnóstico:** `src/data/assessment.ts`, `src/components/DiagnosticView.tsx` y `save_diagnostic` en SQL si cambian las reglas persistentes.
- **Personalidad e instrucciones del tutor:** `tutorPolicy` en `server/ai.ts`.
- **Contexto que recibe la IA:** `buildContext` y `retrieve` en `server/ai.ts`, junto con las consultas de `netlify/functions/ai.ts`.
- **Modelo, clave y cuotas:** configuración del entorno; para otro proveedor también hace falta implementar un adaptador.
- **Registro, recuperación y cuenta:** `Auth.tsx`, la sección de cuenta de `App.tsx`, `account.ts` y configuración de Supabase.
- **Progreso y repasos:** reglas de `src/domain/learning.ts`, llamadas desde las pantallas y funciones SQL. Mantener coherentes las reglas del navegador y del servidor.
- **Nuevos datos persistentes:** tipos en `src/domain/types.ts`, nueva migración SQL, lectura en `useLearner.ts` y pantallas correspondientes.
- **Publicación y rutas de API:** `netlify.toml`; para desarrollo local también `scripts/dev.ts` y `vite.config.ts`.

## 9. Qué falta verificar antes del piloto

Esta revisión documenta código local. No se han comprobado desde esta tarea cuentas externas, correo, despliegue ni llamadas reales al proveedor.

- Configurar Supabase, aplicar migración e importar el catálogo.
- Probar invitaciones, confirmación por correo, recuperación y eliminación de cuenta en el servicio real.
- Elegir y configurar el modelo Gemini; probar respuestas educativas y audio si se habilita.
- Comprobar la continuidad de lecciones y diagnóstico desde dos dispositivos, incluidos conflictos.
- Revisar pedagógicamente contenido y diagnóstico; ampliar el catálogo para una cobertura más completa de A1–B2.
- Probar micrófono, reproducción, accesibilidad y adaptación en navegadores y celulares del piloto.
- Ejecutar las pruebas y la compilación antes de publicar; PGlite y las respuestas simuladas no sustituyen las integraciones reales.
- Preparar respaldos y restauración, gestión de reportes y seguimiento de cuotas.

También hay detalles de implementación a considerar al ampliar: el tutor recupera contenido del catálogo local, mientras que las cuentas leen lecciones de la base; editar solo la base puede desalinearlos. Los cuadros de respuestas admiten hasta 4000 caracteres, pero la solicitud de IA acepta mensajes de hasta 2000, incluida la consigna, por lo que un texto largo puede guardarse y aun así ser rechazado para feedback. Se documentan estos límites; esta tarea no los modifica.

## 10. Documentación complementaria

- [README.md](README.md): presentación y comandos básicos.
- [SETUP_GUIDE.md](SETUP_GUIDE.md): instalación y configuración detalladas.
- [ARCHITECTURE.md](ARCHITECTURE.md): distribución de responsabilidades.
- [DATABASE.md](DATABASE.md): persistencia y seguridad de datos.
- [docs/ALCANCE.md](docs/ALCANCE.md): alcance acordado del piloto.
- [PROMPT_ORIGINAL.md](PROMPT_ORIGINAL.md): visión original; sus propuestas no equivalen por sí mismas a funciones implementadas.
- [BITACORA.md](BITACORA.md): solicitudes e historial de trabajo; las ideas pendientes no se ejecutan automáticamente.

Al revisar el repositorio, el README también menciona `AI_SYSTEM.md`, `TOKEN_OPTIMIZATION.md`, `DATASETS.md`, `PROJECT_MAP.md` y `docs/PENDIENTES.md`, pero esos archivos no están presentes en esta raíz. Esta guía concentra la explicación del sistema de IA, recursos, contenido, mapa y pendientes sin presuponer que existan esos documentos.
