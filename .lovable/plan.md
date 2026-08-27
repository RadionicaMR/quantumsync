# Aviso por email a Mauricio en cada nuevo registro

## Objetivo
Cada vez que alguien crea una cuenta nueva en QuantumSync, te llega un email automático a **mauriramosgs@gmail.com** con los datos del nuevo usuario: nombre, email y WhatsApp (con enlace directo a `wa.me` para escribirle).

## Qué se construye

### 1. Dominio de envío (requiere tu acción)
- Configuramos el dominio remitente **quantumsync.com.ar** (ej: `avisos@quantumsync.com.ar`).
- Se abrirá el asistente de configuración; hay que agregar registros en el DNS del dominio (te guío). Los emails empiezan a enviarse apenas se verifica (puede demorar hasta 72 h, suele ser mucho menos).

### 2. Infraestructura de emails
- Activación de la infraestructura de envío del backend (cola con reintentos) y creación de la función de envío y la plantilla de aviso.

### 3. Plantilla de email "Nuevo usuario registrado"
- Asunto: `Nuevo registro en QuantumSync: {nombre}`.
- Cuerpo: nombre, email, WhatsApp con botón "Escribirle por WhatsApp" (wa.me), y fecha/hora del registro.

### 4. Disparadores del aviso
Se cubren los dos caminos por los que se crean cuentas:
- **Registro normal** (`/register2974AHXW12` y pantalla de acceso): tras un `signUp` exitoso, se invoca el envío con nombre/email/WhatsApp.
- **Alta manual desde el panel admin** (`admin-create-user`): la misma notificación desde la función del backend.

### 5. Página de baja del footer
- El sistema agrega automáticamente un pie de baja en cada email; se crea la página correspondiente en la app para que el enlace funcione.

## Detalles técnicos

| Paso | Recurso |
|---|---|
| Dominio | Diálogo de configuración de email (quantumsync.com.ar) |
| Infra | `setup_email_infra` + `scaffold_transactional_email` |
| Plantilla | `supabase/functions/_shared/transactional-email-templates/new-user-registered.tsx` + registro en `registry.ts` |
| Envío | Función `send-transactional-email` (existente del scaffold), invocada con `templateName: 'new-user-registered'`, destinatario `mauriramosgs@gmail.com`, `templateData` con nombre/email/whatsapp, `idempotencyKey` por usuario |
| Trigger registro | `src/context/AuthContext.tsx` (después de `signUp` exitoso) |
| Trigger admin | `supabase/functions/admin-create-user/index.ts` (después de crear el usuario) |
| Página baja | Ruta indicada por el scaffold (ej. `/unsubscribe`) |
| Deploy | `deploy_edge_functions` para las funciones afectadas |

Sin costo por mensaje y sin servicios externos: usa la infraestructura de email de Lovable Cloud. El aviso es interno (un solo destinatario: vos), permitido como notificación operativa.
