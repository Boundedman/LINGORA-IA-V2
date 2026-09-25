# Conectar Netlify con FastAPI

Netlify publica `front/dist`. El servidor Python debe ejecutarse en un servicio
web: `render.yaml` prepara uno en Render, usando Supabase como base de datos.

1. Sube los cambios al repositorio conectado a Netlify, incluido `render.yaml`.
2. En Render, selecciona **New > Blueprint** y conecta ese mismo repositorio.
3. Completa las variables que solicita el Blueprint:
   - `DATABASE_URL`: el valor de tu `.env` local para Supabase, con SSL.
   - `APP_URL`: la dirección HTTPS exacta de tu sitio Netlify, sin rutas.
   - `AI_MODEL` y `AI_API_KEY`: los valores que ya utilizas localmente.
   Introduce los secretos solo en Render, no en Git ni en variables `VITE_*`.
4. Cuando termine, abre `https://TU-BACKEND.onrender.com/api/health`.
   Debe responder con `status: ok` y `storage: postgresql`.
5. Agrega al `netlify.toml` raíz esta regla, sustituyendo el dominio por la URL
   real que asignó Render, y vuelve a desplegar Netlify:

   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://TU-BACKEND.onrender.com/api/:splat"
     status = 200
     force = true
   ```

6. Comprueba `https://TU-SITIO.netlify.app/api/health` y prueba iniciar sesión,
   guardar el perfil y enviar un mensaje al tutor. Las cookies viajan mediante
   Netlify; no cambies el frontend para llamar directamente a Render.

El código permite el origen exacto configurado en `APP_URL` y conserva el rechazo
de otros orígenes. No necesitas abrir CORS a todos los sitios. `COOKIE_SECURE=true`
mantiene la cookie de sesión en HTTPS. Si cambias el dominio público, actualiza
`APP_URL` en Render. Las URLs de previews no quedan autorizadas automáticamente.

El plan gratuito puede suspenderse por inactividad; una primera petición puede
tardar o agotar el tiempo del proxy. Esta configuración no crea otro PostgreSQL:
utiliza tu Supabase existente. El correo de recuperación requiere las variables
SMTP descritas en `.env.example`; Render Free bloquea los puertos SMTP habituales,
por lo que esa función requiere otro plan compatible o adaptar el envío a una API.

Fuentes: https://render.com/docs/deploy-fastapi,
https://render.com/docs/blueprint-spec y
https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/.
