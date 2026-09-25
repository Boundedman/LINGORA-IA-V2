# Funciones archivadas

- `ai.ts`: POST de tutor, escritura, explicación y audio; autentica, reserva cuota, consulta contexto/caché y llama a Gemini.
- `account.ts`: exportación, borrado de conversación y eliminación de cuenta Supabase.

Importan `../../server/`. Se conservan para consulta y pruebas históricas. La interfaz actual llama a `back/main.py`; no conectes estas funciones a ella sin una migración explícita.
