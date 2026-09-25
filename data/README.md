# Datos locales

`lingora.sqlite3` guarda usuarios, sesiones, recuperación y actividad educativa. FastAPI lo crea al iniciar; `DATABASE_PATH` configura su ubicación. SQLite puede crear archivos auxiliares durante escrituras.

Los datos se excluyen de Git; este README sí puede versionarse. No edites la base manualmente ni la compartas entre servidores mediante una carpeta sincronizada. Detén FastAPI antes de copiar o restaurar el archivo. La reorganización conserva la ubicación de los datos existentes. Consulta [DATABASE.md](../docs/DATABASE.md).
