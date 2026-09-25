# Netlify anterior

[functions/](functions/README.md) conserva los endpoints serverless previos, que usan `legacy/server/` y Supabase. `../netlify.toml` recoge el despliegue histórico.

No interviene en Python. El monolito requiere un servidor FastAPI y disco persistente; publicar solo archivos estáticos en Netlify no lo instala.
