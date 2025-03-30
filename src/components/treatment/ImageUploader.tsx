
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  title: string;
  subtitle: string;
  image: string | null;
  setImage: (image: string | null) => void;
  images: string[];
  setImages: (images: string[]) => void;
  isPlaying: boolean;
  maxImages?: number;
}

const ImageUploader = ({
  title,
  subtitle,
  image,
  setImage,
  images,
  setImages,
  isPlaying,
  maxImages = 3
}: ImageUploaderProps) => {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const handleSingleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Limit to maxImages
      const filesToProcess = Array.from(files).slice(0, maxImages);
      
      Promise.all(filesToProcess.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      })).then(newImages => {
        setImages(prevImages => {
          const combined = [...prevImages, ...newImages];
          return combined.slice(0, maxImages); // Ensure we don't exceed maxImages
        });
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (activeTab === 'single' && fileInputRef.current && !isPlaying) {
      fileInputRef.current.click();
    } else if (activeTab === 'multiple' && multipleFileInputRef.current && !isPlaying) {
      multipleFileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 bg-muted/50 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      
      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'single' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setActiveTab('single')}
            disabled={isPlaying}
          >
            Imagen Única
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'multiple' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setActiveTab('multiple')}
            disabled={isPlaying}
          >
            Múltiples Imágenes
          </button>
        </div>
        
        {activeTab === 'single' && (
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer"
            onClick={isPlaying ? undefined : triggerFileInput}
          >
            {image ? (
              <div className="relative">
                <img 
                  src={image}
                  alt={title}
                  className="max-h-40 mx-auto object-contain rounded"
                />
                {!isPlaying && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">{subtitle}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Arrastra o selecciona una imagen
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSingleImageUpload}
              accept="image/*"
              className="hidden"
              disabled={isPlaying}
            />
          </div>
        )}
        
        {activeTab === 'multiple' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-muted/30 rounded overflow-hidden">
                  <img
                    src={img}
                    alt={`${title} ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {!isPlaying && (
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              
              {images.length < maxImages && !isPlaying && (
                <div
                  className="flex items-center justify-center aspect-square bg-muted/30 rounded cursor-pointer border-2 border-dashed border-border"
                  onClick={triggerFileInput}
                >
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <input
              type="file"
              multiple
              ref={multipleFileInputRef}
              onChange={handleMultipleImageUpload}
              accept="image/*"
              className="hidden"
              disabled={isPlaying}
            />
            
            <div className="text-center text-xs text-muted-foreground">
              {images.length} / {maxImages} imágenes
              {images.length === 0 && (
                <p className="mt-1">Selecciona hasta {maxImages} imágenes para un efecto hipnótico</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
