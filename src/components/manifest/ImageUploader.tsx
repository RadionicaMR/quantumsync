
import React, { useRef, useState } from 'react';
import { Upload, Trash2, Library } from 'lucide-react';
import { Label } from '@/components/ui/label';
import MultipleImagesGrid from '@/components/treatment/image-uploader/MultipleImagesGrid';
import ImageGalleryDialog from '@/components/shared/ImageGalleryDialog';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  setImage: (image: string | null) => void;
  isDisabled: boolean;
  description?: string;
  // New props for multiple images support
  isMultiple?: boolean;
  images?: string[];
  setImages?: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader = ({
  label,
  image,
  setImage,
  isDisabled,
  description,
  isMultiple = false,
  images = [],
  setImages = () => {},
  maxImages = 3
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (isMultiple) {
        // For multiple images mode - handle multiple files
        const filesToProcess = Array.from(files).slice(0, maxImages - images.length);
        
        Promise.all(filesToProcess.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        })).then(newImages => {
          const combined = [...images, ...newImages];
          const limitedImages = combined.slice(0, maxImages);
          setImages(limitedImages);
        });
      } else {
        // For single image mode
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddImage = (image: string) => {
    if (images.length < maxImages) {
      setImages([...images, image]);
    }
  };

  const handleGallerySelect = (selectedImages: string[]) => {
    if (isMultiple) {
      const combined = [...images, ...selectedImages];
      const limitedImages = combined.slice(0, maxImages);
      setImages(limitedImages);
    } else if (selectedImages.length > 0) {
      setImage(selectedImages[0]);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <button
          onClick={() => setGalleryOpen(true)}
          disabled={isDisabled}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors disabled:opacity-50"
        >
          <Library className="w-3 h-3" />
          Galería
        </button>
      </div>
      {isMultiple ? (
        // Multiple images mode
        <div className="border-2 border-dashed border-border rounded-xl p-4">
          <MultipleImagesGrid 
            images={images}
            onRemoveImage={handleRemoveImage}
            onAddImageClick={triggerImageUpload}
            isDisabled={isDisabled}
            maxImages={maxImages}
            onImageAdded={handleAddImage}
          />
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple={isMultiple}
            className="hidden"
            disabled={isDisabled}
          />
        </div>
      ) : (
        // Single image mode (original functionality)
        <div 
          className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer relative"
          onClick={triggerImageUpload}
        >
          {image ? (
            <div className="relative h-40 w-full overflow-hidden rounded-xl">
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
              <div className="mt-4 flex justify-center">
                <button 
                  className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerImageUpload();
                  }}
                  disabled={isDisabled}
                >
                  Subir desde PC
                </button>
              </div>
            </div>
          )}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple={isMultiple}
            className="hidden"
            disabled={isDisabled}
          />
        </div>
      )}

      <ImageGalleryDialog
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleGallerySelect}
        maxSelection={isMultiple ? maxImages : 1}
        multiSelect={isMultiple}
      />
    </>
  );
};

export default ImageUploader;
