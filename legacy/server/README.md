# Servidor TypeScript anterior

- `http.ts`: JSON, verificación de tokens Supabase y cliente administrativo.
- `ai.ts`: validación Zod, presupuestos, recuperación, contexto, política y adaptador Gemini.

Los usan las funciones archivadas de Netlify y `legacy/tests/`. La aplicación actual implementa estas responsabilidades en `back/`. El catálogo de referencia se importa desde `front/src/data/`; no añadas aquí cambios destinados a FastAPI.
