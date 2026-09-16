# Eliminar los tres círculos violetas del visualizador

## Problema
Al iniciar una sesión, el visualizador muestra tres círculos violetas concéntricos sobre los gráficos e imágenes, tanto en Tratamiento como en Manifestación.

## Causa (verificada en el código)
Los círculos provienen de dos bloques de código:

1. **Tratamiento** — `src/components/treatment/TreatmentVisualizer.tsx` (líneas 238-242): un bloque incrustado que dibuja los tres círculos (`w-12`, `w-24`, `w-36` en color quantum-primary) sobre el lienzo cuando la sesión está activa.
2. **Manifestación** — `src/components/manifest/visualizer/StaticOverlayCircles.tsx`: componente dedicado que dibuja los mismos tres círculos, renderizado desde `src/components/manifest/visualizer/VisualizationContainer.tsx`.

## Cambios

1. **Tratamiento**: eliminar el bloque de los tres círculos en `TreatmentVisualizer.tsx` (el `<div>` con `z-30` que contiene los tres círculos `bg-quantum-primary`). El estado `displayAlternate` sigue usándose para alternar las imágenes, así que no se toca ninguna otra lógica.
2. **Manifestación**: quitar el uso de `StaticOverlayCircles` en `VisualizationContainer.tsx` (import + render) y eliminar el archivo `StaticOverlayCircles.tsx`, que ya no tendrá usos.

## Lo que no cambia
- Las imágenes de patrón/receptor, la intención, los rates y el texto de frecuencia del visualizador permanecen igual.
- Otros elementos circulares fuera del visualizador (péndulo, diagnóstico, uploader) no se tocan.

## Verificación
- Iniciar una sesión de Tratamiento y confirmar que ya no aparecen los círculos violetas.
- Iniciar una sesión de Manifestación y confirmar lo mismo.
- Confirmar que las imágenes y textos del visualizador siguen mostrándose y alternando normalmente.
