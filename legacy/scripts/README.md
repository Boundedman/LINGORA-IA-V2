# Herramientas archivadas

- `dev.ts`: servidor HTTP TypeScript antiguo en 8787 y lanzamiento de Vite. Referencia histórica: el proxy actual apunta a FastAPI en 8000; no es el comando de desarrollo vigente.
- `seed.ts`: importa catálogo a Supabase usando clave de servicio. `npm run seed:legacy` modifica la base externa configurada.
- `test-db.ts`: ejecuta la migración en PGlite con autenticación simulada y comprueba aislamiento, progreso, cuotas y eliminación. Usa `npm run test:db:legacy`.

Los comandos se ejecutan desde la raíz. No son necesarios para cuentas o progreso SQLite; las herramientas vigentes están en `scripts/` en la raíz.
