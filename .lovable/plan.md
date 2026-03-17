
# Plan de Reparación Definitiva para Safari/iOS

## Problema Real

Cada revisión anterior corrigió bugs parcialmente pero dejó otros sin detectar. La causa raíz es siempre la misma: **saturación del hilo principal de Safari** por `console.log` en callbacks que se ejecutan 60 veces por segundo, y problemas menores de tipos incorrectos.

## Bugs Encontrados

### Bug 1 -- CRITICO: console.log a 60fps en useChakraProgress.ts
El archivo `src/hooks/balance/useChakraProgress.ts` tiene `console.log` en la función `updateProgress` (linea 31) que se llama desde `requestAnimationFrame` a 60fps. Esto satura completamente el hilo principal de Safari y causa que la armonización de chakras se congele.

Lineas afectadas:
- Linea 16-17: log en useEffect de cambio de chakra (menor)
- Linea 28-29: log en updateProgress -- SE LLAMA A 60FPS
- Linea 39-40: log en resetProgress (menor)
- Linea 48-49: log en setCurrentChakraWithReset (menor)

Solucion: Eliminar TODOS los console.log de este archivo.

### Bug 2 -- MEDIO: Tipos NodeJS.Timeout en useChakraTimers.ts
El archivo `src/hooks/balance/useChakraTimers.ts` usa `NodeJS.Timeout` (lineas 7 y 10) en vez de `number`. En Safari, `setTimeout` devuelve `number`. Ademas usa `clearInterval`/`clearTimeout`/`setTimeout` sin el prefijo `window.`, lo que puede generar ambiguedad.

Solucion: Cambiar tipos a `number | null` y usar `window.setTimeout`/`window.clearTimeout` consistentemente.

### Bug 3 -- MENOR: Tipo NodeJS.Timeout en useTreatmentImages.tsx
El archivo `src/hooks/treatment/useTreatmentImages.tsx` linea 16 usa `number | NodeJS.Timeout` para `hypnoticTimerRef`. Debe ser solo `number`.

Solucion: Cambiar a `number | null` y usar `window.setInterval`.

### Bug 4 -- MEDIO: console.log residuales en hooks de transicion
Archivos `useChakraTransition.ts` y `useChakraSequence.ts` todavia tienen algunos `console.log` en rutas de transicion que, si bien no son a 60fps, generan ruido innecesario en Safari durante transiciones rapidas.

## Archivos a Modificar

1. **src/hooks/balance/useChakraProgress.ts** -- Eliminar todos los console.log
2. **src/hooks/balance/useChakraTimers.ts** -- Corregir tipos y usar window.setTimeout/clearTimeout
3. **src/hooks/useTreatmentImages.tsx** -- Corregir tipo de timer ref

## Detalles Tecnicos

### useChakraProgress.ts
```typescript
// ANTES (Bug - se ejecuta a 60fps):
const updateProgress = useCallback((newProgress: number) => {
  if (newProgress === 100) {
    isTransitioningToNextChakra.current = true;
    console.log(`useChakraProgress: Setting progress to ${newProgress}...`);
  } else {
    console.log(`useChakraProgress: Setting progress to ${newProgress}`);
  }
  setProgress(newProgress);
  ...
}, []);

// DESPUES:
const updateProgress = useCallback((newProgress: number) => {
  if (newProgress === 100) {
    isTransitioningToNextChakra.current = true;
  }
  setProgress(newProgress);
  progressUpdatedTimeRef.current = Date.now();
}, []);
```

### useChakraTimers.ts
```typescript
// ANTES:
const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// ...
clearInterval(progressIntervalRef.current);
clearTimeout(chakraTimerRef.current);

// DESPUES:
const chakraTimerRef = useRef<number | null>(null);
const completionTimeoutRef = useRef<number | null>(null);
// ...
window.clearInterval(progressIntervalRef.current);
window.clearTimeout(chakraTimerRef.current);
```

### useTreatmentImages.tsx
```typescript
// ANTES:
const hypnoticTimerRef = useRef<number | NodeJS.Timeout | null>(null);
clearInterval(hypnoticTimerRef.current as NodeJS.Timeout);

// DESPUES:
const hypnoticTimerRef = useRef<number | null>(null);
window.clearInterval(hypnoticTimerRef.current!);
```

## Por que esto no se detecto antes

El patron se repite: cada revision se enfocaba en los archivos ya conocidos como problematicos, pero no se auditaban los archivos "de soporte" como `useChakraProgress.ts` que son llamados indirectamente. El `updateProgress` se pasa como callback a `startProgressTimer` que lo llama desde `requestAnimationFrame` -- es la misma cadena que ya se limpió en otros archivos pero este eslabón quedó sin revisar.
