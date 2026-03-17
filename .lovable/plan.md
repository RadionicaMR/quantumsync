

## Plan: Dial Rotatorio para RATES + Fix de errores TypeScript

### 1. Crear componente `RateDial` (nuevo archivo)

**`src/components/shared/RateDial.tsx`** - Un dial circular grande en estilo negro/plateado:
- Dial SVG circular con rango 0-100, marcas de graduación y números
- Colores: fondo negro, arco/borde plateado, indicador brillante
- Se abre como Dialog/popup cuando el usuario hace clic en el input de rate
- Interacción PC: mousedown en el dial, arrastrar girando, mouseup cierra y confirma valor
- Interacción móvil/tablet: touchstart, touchmove girando, touchend cierra y confirma
- El valor se calcula por el ángulo del punto de contacto respecto al centro del dial
- Ejemplo: si el dial marca 8.3, el rate muestra "83" (valor x10, sin decimal)
- Al soltar, el popup se cierra automáticamente y el valor aparece en el input correspondiente

Mecánica del dial:
- Arco de 270° (de 135° a 405°), con 0 abajo-izquierda y 100 abajo-derecha
- Se calcula el ángulo del cursor/dedo respecto al centro del SVG
- Se mapea ese ángulo a un valor 0.0-100.0
- El valor mostrado en el rate input = `Math.round(valor * 10)` → rango 0-1000

### 2. Integrar el dial en `RateInputs.tsx` (Tratamiento Custom)

- Agregar estado `dialOpen` y `activeRateField` para saber cuál rate se está editando
- Al hacer clic/focus en cualquier input de rate, abrir el Dialog con el RateDial
- Al soltar el dial, cerrar el Dialog y setear el valor en el rate correspondiente
- Mantener el botón de generación aleatoria existente (Square icon)

### 3. Integrar el dial en `RateSection.tsx` (Tratamiento Preset / Manifestación)

- Misma lógica: al hacer clic en el input, abrir el dial popup
- Al soltar, cerrar y escribir el valor

### 4. Fix errores TypeScript `NodeJS.Timeout`

Reemplazar `NodeJS.Timeout` por `ReturnType<typeof setTimeout>` en los 5 archivos afectados:
- `src/hooks/manifest/types.ts`
- `src/hooks/manifest/useManifestTimers.ts`
- `src/hooks/manifest/useManifestImageControl.tsx`
- `src/components/treatment/TreatmentVisualizer.tsx`
- `src/components/manifest/visualizer/StaticOverlayCircles.tsx`

### Resumen de archivos a crear/editar

| Archivo | Acción |
|---------|--------|
| `src/components/shared/RateDial.tsx` | Crear - componente dial rotatorio |
| `src/components/treatment/RateInputs.tsx` | Editar - integrar dial popup |
| `src/components/treatment/preset/RateSection.tsx` | Editar - integrar dial popup |
| `src/hooks/manifest/types.ts` | Editar - fix NodeJS.Timeout |
| `src/hooks/manifest/useManifestTimers.ts` | Editar - fix NodeJS.Timeout |
| `src/hooks/manifest/useManifestImageControl.tsx` | Editar - fix NodeJS.Timeout |
| `src/components/treatment/TreatmentVisualizer.tsx` | Editar - fix NodeJS.Timeout |
| `src/components/manifest/visualizer/StaticOverlayCircles.tsx` | Editar - fix NodeJS.Timeout |

