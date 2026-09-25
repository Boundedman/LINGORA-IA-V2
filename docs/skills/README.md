# Skills de desarrollo

[lingora-cambridge/SKILL.md](lingora-cambridge/SKILL.md) es la fuente versionable de la skill para usar Cambridge como referencia y recurso externo. Define creación de contenido original A1–B2, construcción centralizada de enlaces, límites de reutilización y comprobaciones.

Su copia instalable vive en `~/.codex/skills/lingora-cambridge/SKILL.md`. En otra máquina puede copiarse esa carpeta al directorio de skills personal; para usarla en una sesión donde aún no se haya descubierto, indica su ruta o invócala como `$lingora-cambridge` después de cargarla. Mantén ambas copias sincronizadas al modificarla.

Esta skill dirige el trabajo de desarrollo, no el tutor en ejecución. No contiene claves, datos del alumno, definiciones ni audios de Cambridge.

## Validación local

El validador oficial `quick_validate.py` requiere PyYAML. Se preparó un entorno independiente en `artifacts/skill-validation/` con esa herramienta, sin añadir dependencias a la aplicación. Desde la raíz, en esta máquina:

```powershell
artifacts/skill-validation/Scripts/python.exe -X utf8 C:/Users/raged/.codex/skills/.system/skill-creator/scripts/quick_validate.py docs/skills/lingora-cambridge
```

La fuente y la copia personal pasaron la validación. Esto comprueba la estructura de la skill, no la disponibilidad de Cambridge: las consultas automatizadas de prueba siguen recibiendo HTTP 403. La navegación manual desde el navegador del alumno queda por comprobar.
