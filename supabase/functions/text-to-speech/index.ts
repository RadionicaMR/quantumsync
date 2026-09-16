import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

function chunkText(text: string, maxWords = 300): string[] {
  const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };
  for (const sentence of sentences) {
    if (wordCount(sentence) > maxWords) {
      flush();
      const words = sentence.match(/\S+/g) ?? [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
      }
      continue;
    }
    if (current && wordCount(current) + wordCount(sentence) > maxWords) flush();
    current += sentence;
  }
  flush();
  return chunks;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    if (!LOVABLE_API_KEY) {
      return json({ error: 'Servicio de voz no configurado' }, 500);
    }

    const body = await req.json().catch(() => null);
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const voice = typeof body?.voice === 'string' && VOICES.includes(body.voice) ? body.voice : 'alloy';
    const instructions = typeof body?.instructions === 'string' ? body.instructions : undefined;

    if (!text) return json({ error: 'El texto es obligatorio' }, 400);
    if (text.length > 5000) return json({ error: 'El texto es demasiado largo (máximo 5000 caracteres)' }, 400);

    const parts = chunkText(text);
    const audioChunks: string[] = [];

    for (const part of parts) {
      const res = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini-tts',
          input: part,
          voice,
          response_format: 'mp3',
          stream_format: 'audio',
          ...(instructions ? { instructions } : {}),
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('TTS error', res.status, detail);
        if (res.status === 429) {
          return json({ error: 'Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.' }, 429);
        }
        if (res.status === 402) {
          return json({ error: 'Se agotaron los créditos de IA del espacio de trabajo.' }, 402);
        }
        if (res.status === 403) {
          return json({ error: 'La generación de voz está bloqueada por la configuración del espacio de trabajo.' }, 403);
        }
        return json({ error: 'No se pudo generar el audio. Intentá nuevamente.' }, 502);
      }

      const buffer = new Uint8Array(await res.arrayBuffer());
      audioChunks.push(toBase64(buffer));
    }

    return json({ audioChunks, mimeType: 'audio/mpeg' });
  } catch (error) {
    console.error('text-to-speech failure', error);
    return json({ error: 'Error inesperado al generar el audio' }, 500);
  }
});
