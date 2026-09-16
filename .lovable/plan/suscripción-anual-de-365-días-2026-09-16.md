# Suscripción anual de 365 días

Los clientes que abonaron pasan a tener una suscripción de 365 días, visible en el panel de Admin, con recordatorios previos y bloqueo al día 366.

## Qué vas a ver

**En el panel de Admin (pestañas Usuarios y Seguimiento)**
- Nueva columna "Suscripción" para los clientes marcados como Pagado: "Día 128 / 365" y debajo "237 días restantes".
- Aviso visual cuando quedan 30 días o menos (amarillo) y cuando ya venció (rojo: "Vencida - día 372").
- La fecha de inicio de la suscripción de los clientes que ya figuran como pagados se toma de su fecha de registro.
- Renovación manual: al desactivar y volver a activar el interruptor "Pagado" de un cliente, el contador se reinicia en día 1 desde ese momento. Así, cuando alguien te abona, le quitás la restricción desde el panel y vuelve a tener 365 días.

**Para el cliente**
- Pop-up de recordatorio cuando faltan 30, 20 y 5 días para el vencimiento: mensaje de renovación con botón de WhatsApp que abre un chat con vos (+54 2945 581188) y un texto pre-cargado. Cada aviso se muestra una sola vez por umbral.
- A partir del día 366 no puede seguir usando la aplicación: al entrar se lo lleva a una pantalla de suscripción vencida con el botón de WhatsApp para renovar. El acceso vuelve cuando vos lo renovás desde el panel.
- Los administradores nunca quedan bloqueados.

## Detalles técnicos

**Base de datos**
- Migración: agregar `subscription_start_date timestamptz` (nullable) a `profiles`.
- Backfill en la misma migración: `subscription_start_date = created_at` para los perfiles con `has_paid = true`.

**Lógica**
- Nuevo hook `useSubscriptionStatus` (o extensión de `useTrialStatus`): calcula `daysUsed`, `daysRemaining`, `isSubscriptionExpired` a partir de `subscription_start_date + 365 días` cuando `has_paid` es true.
- `useTrialStatus.ts`: incorporar `subscription_start_date` al select de `profiles`.
- `useUsersManagement.ts` → `togglePaymentStatus`: al pasar a pagado, setear `subscription_start_date = new Date().toISOString()`; al desactivar, dejarlo en `null`.
- `ProtectedRoute.tsx`: si `has_paid` y la suscripción venció (y no es admin), redirigir a `/subscription-expired`. Se mantiene la lógica actual de prueba de 7 días.
- Nueva página `src/pages/SubscriptionExpired.tsx` + ruta en `App.tsx`, con botón de WhatsApp.
- Nuevo componente `src/components/trial/SubscriptionRenewalPopup.tsx`, montado en `Layout.tsx` junto a los popups existentes; se dispara con `daysRemaining <= 30 | 20 | 5` y registra el umbral ya mostrado en `localStorage` (`quantumsync-renewal-notice-<umbral>`).
- Admin: columna nueva en `UsersManagementSection.tsx` y en `ClientTrackingTab.tsx` (incluir `subscription_start_date` en los selects).
- Textos en español e inglés vía `useLanguage`.

**Nota**: los clientes pagados registrados hace más de 365 días quedarán vencidos apenas se aplique el cambio; podés renovarlos con el interruptor "Pagado" del panel.
