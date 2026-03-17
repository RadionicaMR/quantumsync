

## Plan: Rates en columna única en móvil + Galería visible en móvil

### Problema 1: Rates no se ven bien en móvil
En la vista móvil, los 6 rates aparecen en 2 columnas (`grid-cols-2`), lo que hace que cada rate quede muy estrecho y no se vea el valor. Solución: cambiar a 1 columna en móvil.

### Problema 2: Botón "Galería" no visible en móvil
Los 3 botones de tabs (Imagen Única, Múltiples Imágenes, Galería) usan `flex space-x-2` y se desbordan horizontalmente en pantallas pequeñas. El botón de Galería queda fuera de la pantalla.

### Cambios

| Archivo | Cambio |
|---------|--------|
| `src/components/treatment/RateInputs.tsx` | Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` (1 col en móvil) |
| `src/components/treatment/preset/RateSection.tsx` | Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6` (1 col en móvil) |
| `src/components/treatment/image-uploader/ImageUploader.tsx` | Tabs: cambiar `flex space-x-2` a `flex flex-wrap gap-2` para que los botones se ajusten en múltiples líneas en móvil. Reducir padding del card en móvil (`p-2 sm:p-4`) |

