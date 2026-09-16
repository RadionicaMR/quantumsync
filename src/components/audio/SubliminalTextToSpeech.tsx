import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Eraser } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SUBLIMINAL_TEXT_STORAGE_KEY = "quantumsync-subliminal-text";

const VOICES = [
  { value: "alloy", label: "Alloy (neutra)" },
  { value: "nova", label: "Nova (femenina)" },
  { value: "shimmer", label: "Shimmer (femenina suave)" },
  { value: "fable", label: "Fable (cálida)" },
  { value: "echo", label: "Echo (masculina)" },
  { value: "onyx", label: "Onyx (masculina grave)" },
];

const MAX_CHARS = 5000;

interface SubliminalTextToSpeechProps {
  setAudioFile: (file: File | null) => void;
  isDisabled?: boolean;
}

const SubliminalTextToSpeech: React.FC<SubliminalTextToSpeechProps> = ({
  setAudioFile,
  isDisabled = false,
}) => {
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(SUBLIMINAL_TEXT_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [voice, setVoice] = useState("nova");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SUBLIMINAL_TEXT_STORAGE_KEY, text);
    } catch {
      /* ignore */
    }
  }, [text]);

  const handleGenerate = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Escribí el texto que querés convertir en audio");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text: trimmed, voice },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const chunks: string[] = data?.audioChunks || [];
      if (!chunks.length) throw new Error("No se recibió audio");

      const parts = chunks.map((base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
      });

      const blob = new Blob(parts, { type: data?.mimeType || "audio/mpeg" });
      const file = new File([blob], "afirmacion-subliminal.mp3", { type: "audio/mpeg" });
      setAudioFile(file);
      toast.success("Audio generado a partir de tu texto");
    } catch (err: any) {
      console.error("Error generando audio desde texto:", err);
      toast.error(err?.message || "No se pudo generar el audio");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2 border-t pt-3 mt-2">
      <Label className="text-sm font-medium">Texto a audio (afirmación)</Label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Escribí aquí tu afirmación o intención. Ej: Estoy en calma y mi cuerpo se regenera."
        rows={3}
        disabled={isDisabled || isGenerating}
        className="resize-y text-sm"
      />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-muted-foreground">
          {text.length}/{MAX_CHARS} caracteres
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={voice} onValueChange={setVoice} disabled={isDisabled || isGenerating}>
            <SelectTrigger className="h-8 w-[170px] text-xs">
              <SelectValue placeholder="Voz" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {VOICES.map((v) => (
                <SelectItem key={v.value} value={v.value} className="text-xs">
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {text.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setText("")}
              disabled={isDisabled || isGenerating}
            >
              <Eraser className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={isDisabled || isGenerating || !text.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                Generar audio
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubliminalTextToSpeech;
