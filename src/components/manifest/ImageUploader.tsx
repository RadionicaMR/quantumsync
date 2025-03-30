
import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  setImage: (image: string | null) => void;
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

  const triggerImageUpload = () => {
    if (fileInputRef.current && !isDisabled) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
  };

  return (
    <>
      <Label className="mb-2 block">{label}</Label>
      <div 
        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer relative"
        onClick={triggerImageUpload}
      >
        {image ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={label} 
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerImageUpload();
                }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                disabled={isDisabled}
              >
                <Upload size={16} />
              </button>
              <button
                onClick={handleDeleteImage}
                className="bg-red-500/70 text-white p-2 rounded-full hover:bg-red-500/90"
                disabled={isDisabled}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="font-medium">{label}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
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
    </>
  );
};

export default ImageUploader;
