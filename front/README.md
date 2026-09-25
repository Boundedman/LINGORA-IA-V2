# Frontend

Interfaz React + TypeScript conservada del prototipo. El navegador solicita datos a `/api`; no accede directamente a SQLite ni a Gemini.

- [src/](src/README.md): pantallas, componentes, estilos, catálogo y estado.
- [tests/](tests/README.md): pruebas de aprendizaje e interacción.
- `index.html`: documento de entrada; carga `src/main.tsx`.
- `vite.config.ts`: establece esta carpeta como raíz de Vite, genera `dist/` y redirige `/api` al puerto 8000 durante desarrollo. Lee variables desde la raíz del proyecto; solo las variables `VITE_` pueden publicarse al navegador. Los secretos no usan ese prefijo.
- `tsconfig.json`: configuración estricta de TypeScript para interfaz, exportador y referencias históricas.
- `dist/`: HTML y archivos compilados. `dist/assets/` contiene JS/CSS con nombres versionados; se regeneran, no se editan ni se versionan.

Desde la raíz, `npm run dev:ui` inicia Vite en 5173. Inicia también `npm run dev:api` para guardar datos. `npm run build` comprueba tipos, exporta lecciones a `back/curriculum.json` y genera `front/dist/`, que FastAPI sirve en 8000. `npm test` ejecuta las pruebas de esta carpeta. Las dependencias se gestionan en el `package.json` de la raíz.
