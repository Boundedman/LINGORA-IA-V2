# Código de interfaz

- `main.tsx`: monta React e importa los estilos.
- `App.tsx`: navegación, inicio, catálogo, repasos, progreso y cuenta; abre lecciones, diagnóstico y tutor.
- `styles.css`: diseño, colores, tipografía, tarjetas y adaptación móvil.
- [components/](components/README.md): actividades y formularios.
- [data/](data/README.md): contenido educativo y preguntas de diagnóstico.
- [domain/](domain/README.md): tipos y cálculos de aprendizaje.
- [lib/](lib/README.md): cliente HTTP y estado del alumno.

El flujo comienza en `main.tsx`, pasa a `App.tsx` y carga estado mediante `useLearner`. Las acciones se envían a FastAPI y sus respuestas actualizan las pantallas. Modifica el aspecto en `styles.css` y los componentes, no en `dist/`.
