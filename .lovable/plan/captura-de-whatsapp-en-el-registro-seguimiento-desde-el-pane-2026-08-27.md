# Captura de WhatsApp en el registro + seguimiento desde el panel

## Objetivo
Que todo usuario nuevo deba ingresar su número de WhatsApp con código de país al crear la cuenta, y que ese dato quede visible (y clickeable) en tu base de clientes del panel de administración.

## Qué se construye

### 1. Campo de WhatsApp en el registro
- Nuevo campo obligatorio en el formulario de registro (`/register2974AHXW12`) y en la pestaña "Registrarse" de la pantalla de acceso.
- Se compone de un selector de código de país (con bandera y prefijo: +54 Argentina, +52 México, +34 España, +57 Colombia, +56 Chile, +51 Perú, +1 EE.UU., etc., con Argentina por defecto) más el campo de número.
- Validación: solo dígitos, entre 6 y 15 cifras; se guarda en formato internacional (ej. `+542945581188`).
- Textos en español e inglés usando el sistema de traducción existente.

### 2. Guardado del dato
- Se agrega la columna `whatsapp_phone` a la tabla de perfiles.
- El número viaja en los metadatos del registro y el proceso automático que crea el perfil lo guarda junto al nombre y el email.
- Los usuarios ya existentes quedan con el campo vacío (se puede completar a mano desde el panel).

### 3. Panel de administración (base de clientes)
- Nueva columna **WhatsApp** en Gestión de Usuarios, entre Nombre y Rol.
- El número se muestra como enlace directo a `wa.me`, que abre el chat con ese cliente desde tu WhatsApp.
- Editable en línea (igual que el nombre), para completar o corregir números.
- Si el usuario no tiene número, muestra "-" con opción de cargarlo.
- El diálogo "Crear Usuario" del admin también incluye el campo de WhatsApp.

## Detalles técnicos

| Archivo / recurso | Cambio |
|---|---|
| Migración de base de datos | `ALTER TABLE public.profiles ADD COLUMN whatsapp_phone text;` y actualización de `handle_new_user()` para leer `raw_user_meta_data->>'whatsapp_phone'` |
| `src/components/shared/WhatsAppPhoneInput.tsx` | Nuevo: selector de país + input numérico, devuelve E.164 |
| `src/pages/Register.tsx` | Agrega el campo, valida y lo pasa a `register()` |
| `src/context/AuthContext.tsx` | `register()` acepta el teléfono y lo envía en `options.data` de `signUp` |
| `src/pages/Auth.tsx` | Mismo campo en el formulario de alta |
| `src/components/admin/CreateUserDialog.tsx` | Campo de WhatsApp en el alta manual |
| `supabase/functions/admin-create-user/index.ts` | Recibe y guarda `whatsapp_phone` en el perfil |
| `src/hooks/useUsersManagement.ts` | Trae `whatsapp_phone` y agrega `updateUserWhatsapp` |
| `src/components/admin/UsersManagementSection.tsx` | Columna WhatsApp con enlace `wa.me` y edición en línea |
| `src/context/LanguageContext.tsx` | Traducciones ES/EN de las nuevas etiquetas |

Las políticas de acceso actuales ya permiten que cada usuario vea/edite su propio perfil y que el administrador vea y edite todos, por lo que no hacen falta reglas nuevas.
