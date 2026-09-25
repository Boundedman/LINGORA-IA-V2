# Implementación anterior

Código de la etapa Supabase + Netlify. FastAPI no lo importa ni ejecuta.

- [server/](server/README.md): autenticación y adaptador IA TypeScript.
- [netlify/](netlify/README.md): funciones HTTP de cuenta y tutor.
- [supabase/](supabase/README.md): esquema PostgreSQL original.
- [scripts/](scripts/README.md): servidor anterior, seed y pruebas SQL.
- [tests/](tests/README.md): pruebas de contexto y proveedor antiguos.
- `netlify.toml`: despliegue histórico; sus rutas y comandos no despliegan el monolito actual.

Las importaciones se ajustaron al catálogo de `front/`. `npm run test:legacy` comprueba estos módulos y `npm run test:db:legacy` su SQL. `npm run seed:legacy` modifica un Supabase configurado; no se necesita para la versión vigente. Reactivar el despliegue anterior requeriría adaptar expresamente su configuración e interfaz.
