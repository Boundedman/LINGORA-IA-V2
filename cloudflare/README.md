# Cloudflare Workers

La configuración principal es `wrangler.jsonc`. Workers sirve `front/dist` y
envía `/api` y `/api/*` al origen HTTPS configurado en `BACKEND_URL`.
Conserva método, cuerpo, cookies, Origin y Set-Cookie; las respuestas API usan
`Cache-Control: no-store`. Sin backend devuelve JSON explícito, nunca el HTML
de React. No agregues credenciales de Supabase o Gemini al Worker.

Pruebas: `node --test cloudflare/worker.test.mjs`.
Instrucciones de publicación: [CLOUDFLARE.md](../docs/CLOUDFLARE.md).
