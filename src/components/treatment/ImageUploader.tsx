
import { useState, useRef } from 'react';
import { Image, Upload, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  title: string;
  subtitle: string;
  image: string | null;
  setImage: (image: string | null) => void;
  isPlaying: boolean;
  className?: string;
}

const ImageUploader = ({
  title,
  subtitle,
  image,
  setImage,
  isPlaying,
  className = '',
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast({
          title: "Imagen cargada",
          description: "La imagen se ha subido correctamente.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const deleteImage = () => {
    if (isPlaying) return;
    
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Imagen eliminada",
      description: `La imagen ha sido eliminada.`,
    });
  };

  return (
    <div className={className}>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        {image ? (
          <div className="relative h-44 w-full overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={title}
              className={`w-full h-full object-contain ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ opacity: isPlaying ? '0.7' : '1' }}
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={deleteImage}
                className="bg-red-500/70 text-white p-2 rounded-full hover:bg-red-600/90 transition-colors"
                disabled={isPlaying}
                title="Eliminar imagen"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={triggerImageUpload}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                disabled={isPlaying}
                title="Cambiar imagen"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => !isPlaying && triggerImageUpload()}
            className="cursor-pointer flex flex-col items-center justify-center h-44 space-y-3"
          >
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
              <Image className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{subtitle}</p>
              <p className="text-sm text-muted-foreground">Selecciona una imagen desde tu galería</p>
            </div>
          </div>
        )}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          disabled={isPlaying}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
