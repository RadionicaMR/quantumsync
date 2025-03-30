
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import SingleImageUploader from './SingleImageUploader';
import MultipleImagesGrid from './MultipleImagesGrid';

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
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

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
        // Create a new array with combined images and pass it directly to setImages
        const combined = [...images, ...newImages];
        const limitedImages = combined.slice(0, maxImages); // Ensure we don't exceed maxImages
        setImages(limitedImages);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const triggerMultipleFileInput = () => {
    if (multipleFileInputRef.current && !isPlaying) {
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
            onClick={isPlaying ? undefined : () => document.getElementById(`fileInput-${title}`)?.click()}
          >
            <SingleImageUploader 
              image={image} 
              onImageChange={setImage} 
              isDisabled={isPlaying}
              placeholder={subtitle}
              inputId={`fileInput-${title}`}
            />
          </div>
        )}
        
        {activeTab === 'multiple' && (
          <div>
            <MultipleImagesGrid 
              images={images}
              onRemoveImage={removeImage}
              onAddImageClick={triggerMultipleFileInput}
              isDisabled={isPlaying}
              maxImages={maxImages}
            />
            
            <input
              type="file"
              multiple
              ref={multipleFileInputRef}
              onChange={handleMultipleImageUpload}
              accept="image/*"
              className="hidden"
              disabled={isPlaying}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
