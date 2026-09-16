# Texto a audio subliminal

Agregar, dentro del bloque AUDIO SUBLIMINAL (Tratamiento y Manifestación), un cuadro de texto donde escribís la afirmación o intención. Con un botón "Generar audio", el texto se convierte en voz y queda cargado como el audio subliminal, que suena junto a la frecuencia a volumen muy bajo (casi imperceptible).

## Cómo se usa

1. Escribís el texto en el nuevo cuadro (por ejemplo: "Estoy en calma y mi cuerpo se regenera").
2. Elegís la voz (varias opciones femeninas y masculinas) y el idioma sale del texto que escribas.
3. Tocás "Generar audio": aparece el archivo generado igual que si lo hubieras subido o grabado.
4. Podés escucharlo con el botón de prueba, activar la repetición continua y dejar el volumen en 0–2 para que sea subliminal.
5. Al iniciar el tratamiento o la manifestación, esa voz se reproduce en bucle debajo de la frecuencia.

Notas:
- El texto se guarda mientras estás en la página; si lo cambiás hay que volver a generar.
- Textos largos se dividen automáticamente en partes y se unen en un solo audio.
- La generación puede tardar unos segundos; se muestra un indicador mientras tanto.

## Detalles técnicos

- Nueva Edge Function `text-to-speech`: recibe `{ text, voice }`, valida sesión del usuario, trocea el texto en fragmentos seguros, llama a `https://ai.gateway.lovable.dev/v1/audio/speech` con `LOVABLE_API_KEY`, modelo `openai/gpt-4o-mini-tts`, `response_format: "mp3"`, `stream_format: "audio"`, y devuelve el audio en base64 (concatenando fragmentos). Manejo de errores 400/401/402/403/429 con mensajes claros al usuario (créditos, límite, etc.).
- Nuevo componente `src/components/audio/SubliminalTextToSpeech.tsx`: textarea con contador de caracteres, selector de voz, botón generar con estado de carga, y botón para limpiar. Al recibir el audio arma un `File` (`afirmacion-subliminal.mp3`) y lo pasa por `setAudioFile`, reutilizando todo el flujo actual (preview, loop, volumen, reproducción en sesión).
- Integración en `src/components/AudioSubliminalControls.tsx`, debajo de los botones de archivo/grabación, para que aparezca automáticamente en Tratamiento y Manifestación (ambos usan ese componente).
- Textos visibles usando el hook `useLanguage` (ES/EN), según la convención del proyecto.
- Sin cambios de esquema ni tablas nuevas; el audio vive en memoria como los actuales.
