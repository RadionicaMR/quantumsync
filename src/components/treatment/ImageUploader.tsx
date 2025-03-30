import { useState, useRef } from 'react';
import { Image, Upload, Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  title: string;
  subtitle: string;
  image: string | null;
  setImage: (image: string | null) => void;
  images?: string[];
  setImages?: (images: string[]) => void; 
  isPlaying: boolean;
  className?: string;
  maxImages?: number;
}

const ImageUploader = ({
  title,
  subtitle,
  image,
  setImage,
  images = [],
  setImages = () => {},
  isPlaying,
  className = '',
  maxImages = 3,
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Límite de imágenes excedido",
        description: `Solo puedes subir hasta ${maxImages} imágenes.`,
      });
      return;
    }
    
    // For backward compatibility, keep the first image in the single image state
    const firstFile = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(firstFile);
    
    // Process all files for the images array
    Array.from(files).forEach(file => {
      const multiReader = new FileReader();
      multiReader.onloadend = () => {
        setImages([...images, multiReader.result as string]);
      };
      multiReader.readAsDataURL(file);
    });
    
    toast({
      title: "Imágenes cargadas",
      description: `Se han subido ${files.length} imagen(es) correctamente.`,
    });
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const deleteImage = (e: React.MouseEvent, index: number) => {
    // Stop propagation to prevent triggering parent div click events
    e.stopPropagation();
    
    if (isPlaying) return;
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Update the single image state if needed
    if (index === 0) {
      setImage(newImages.length > 0 ? newImages[0] : null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada correctamente.",
    });
  };

  return (
    <div className={className}>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        {images.length > 0 ? (
          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="relative h-28 w-full overflow-hidden rounded-lg">
                <img 
                  src={img} 
                  alt={`${title} ${index + 1}`}
                  className={`w-full h-full object-contain ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ opacity: isPlaying ? '0.7' : '1' }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={(e) => deleteImage(e, index)}
                    className="bg-red-500/70 text-white p-2 rounded-full hover:bg-red-600/90 transition-colors"
                    disabled={isPlaying}
                    title="Eliminar imagen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {images.length < maxImages && (
              <button
                onClick={triggerImageUpload}
                disabled={isPlaying}
                className="mt-2 flex items-center justify-center w-full py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Añadir imagen ({images.length}/{maxImages})
              </button>
            )}
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
              <p className="text-sm text-muted-foreground">Selecciona hasta {maxImages} imágenes desde tu galería</p>
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
          multiple
        />
      </div>
    </div>
  );
};

export default ImageUploader;
