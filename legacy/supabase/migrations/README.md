# Migración SQL histórica

`001_initial.sql` crea invitaciones, perfiles, catálogo, avances, respuestas, errores, repasos, diagnóstico, mensajes, reportes, cuotas y caché. Incluye permisos RLS y funciones transaccionales.

Fue diseñada para ejecutarse una vez en un Supabase nuevo. `npm run test:db:legacy` la comprueba con PostgreSQL embebido y autenticación simulada. No se ejecuta en SQLite: el esquema actual se crea en `back/storage.py`.
