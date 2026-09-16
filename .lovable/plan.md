# Prueba gratuita: de 7 a 3 días

Cambiar la duración de la prueba gratuita a 3 días y actualizar todos los textos visibles.

## Qué cambia para el visitante

- Todos los botones de la página de inicio pasan a decir "PRUEBA GRATIS 3 DÍAS".
- El popup de bienvenida (a los 30 segundos) dice "Prueba GRATIS durante 3 días" y "3 días de acceso completo".
- La cuenta regresiva dentro de la app calcula sobre 3 días.
- La pantalla de prueba vencida dice "Los 3 días de prueba gratuita han terminado".

## Qué cambia para vos (Admin)

- En las pestañas Usuarios y Seguimiento, la prueba se muestra como "Prueba día X/3".
- El aviso de WhatsApp durante la prueba pasa a mostrarse el último día (1 día restante) en lugar de los días 5 y 6.

## Importante

Los usuarios que hoy están en prueba y ya llevan más de 3 días desde su registro quedarán con la prueba vencida apenas se aplique el cambio. Si querés que algunos sigan, se los habilita con el interruptor "Pagado" del panel.

## Detalles técnicos

- Nueva constante compartida `TRIAL_DAYS = 3` (en `src/hooks/useTrialStatus.ts`, exportada).
- `useTrialStatus.ts`: reemplazar `7 * 24 * 60 * 60 * 1000` por `TRIAL_DAYS * 24 * 60 * 60 * 1000`.
- `src/components/admin/ClientTrackingTab.tsx`: usar la constante compartida en lugar del `TRIAL_DAYS = 7` local.
- Textos: `NewHeroSection.tsx`, `PricingSection.tsx`, `CTAButton.tsx`, `SolutionSection.tsx`, `FreeTrialPopup.tsx`, `TrialExpired.tsx`.
- `TrialSupportPopup.tsx`: ajustar el umbral de días restantes a 1 día (y comentario).
- No se tocan los selectores "Últimos 7 días" de las pestañas de analítica.
