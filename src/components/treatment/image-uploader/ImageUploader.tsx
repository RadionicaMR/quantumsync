import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import SingleImageUploader from './SingleImageUploader';
import MultipleImagesGrid from './MultipleImagesGrid';
import ImageGalleryDialog from '@/components/shared/ImageGalleryDialog';
import { Library } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageUploaderProps {
  title: string;
  subtitle: string;
  image: string | null;
  setImage: (image: string | null) => void;
  images: string[];
  setImages: (images: string[]) => void;
  isPlaying: boolean;
  maxImages?: number;
  category?: 'radionic' | 'pattern' | 'receptor' | 'chakra' | 'all';
}

const ImageUploader = ({
  title,
  subtitle,
  image,
  setImage,
  images,
  setImages,
  isPlaying,
  maxImages = 3,
  category = 'all'
}: ImageUploaderProps) => {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple' | 'gallery'>('multiple');
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { t } = useLanguage();

  const handleMultipleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
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
        const combined = [...images, ...newImages];
        const limitedImages = combined.slice(0, maxImages);
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

  const handleAddSingleImageToMultiple = (newImage: string) => {
    if (images.length < maxImages) {
      setImages([...images, newImage]);
    }
  };

  const handleGallerySelect = (selectedImages: string[]) => {
    if (activeTab === 'gallery') {
      const combined = [...images, ...selectedImages];
      const limitedImages = combined.slice(0, maxImages);
      setImages(limitedImages);
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
            {t('image.singleImage')}
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'multiple' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setActiveTab('multiple')}
            disabled={isPlaying}
          >
            {t('image.multipleImages')}
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeTab === 'gallery' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => {
              setActiveTab('gallery');
              setGalleryOpen(true);
            }}
            disabled={isPlaying}
          >
            <Library className="w-4 h-4" />
            {t('image.gallery')}
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
              onImageAdded={handleAddSingleImageToMultiple}
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

        {activeTab === 'gallery' && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Library className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              {t('image.selectFromGallery')}
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => setGalleryOpen(true)}
              disabled={isPlaying}
            >
              {t('image.openGallery')}
            </button>
            {images.length > 0 && (
              <div className="mt-4">
                <MultipleImagesGrid 
                  images={images}
                  onRemoveImage={removeImage}
                  onAddImageClick={() => setGalleryOpen(true)}
                  isDisabled={isPlaying}
                  maxImages={maxImages}
                  onImageAdded={handleAddSingleImageToMultiple}
                />
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {images.length} / {maxImages} {t('image.imagesCount')}
        </p>
        <p className="text-xs text-muted-foreground text-center">
          {t('image.selectUpTo')} {maxImages} {t('image.imagesForHypnotic')}
        </p>
      </div>

      <ImageGalleryDialog
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleGallerySelect}
        maxSelection={maxImages}
        multiSelect={true}
        category={category}
      />
    </Card>
  );
};

export default ImageUploader;
