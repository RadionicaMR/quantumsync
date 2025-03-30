
import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  setImage: (value: string | null) => void;
  isDisabled: boolean;
  description?: string;
}

const ImageUploader = ({ 
  label, 
  image, 
  setImage, 
  isDisabled,
  description 
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  return (
    <Card className="h-full quantum-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-muted/30'}`}
          onClick={handleClick}
        >
          {image ? (
            <div className="relative w-full aspect-square">
              <img 
                src={image} 
                alt={label} 
                className="mx-auto max-h-[200px] object-contain" 
              />
              {!isDisabled && (
                <button 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-center text-sm text-muted-foreground">{description || 'Haz clic para subir una imagen'}</p>
            </>
          )}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
