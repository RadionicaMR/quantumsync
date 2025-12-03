import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MultipleImagesGridProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  onAddImageClick: () => void;
  isDisabled: boolean;
  maxImages: number;
  onImageAdded: (image: string) => void;
}

const MultipleImagesGrid = ({ 
  images, 
  onRemoveImage, 
  onAddImageClick, 
  isDisabled, 
  maxImages,
  onImageAdded
}: MultipleImagesGridProps) => {
  const { t, language } = useLanguage();
  const canAddMoreImages = images.length < maxImages;
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square bg-muted/30 rounded overflow-hidden">
            <img
              src={img}
              alt={`Image ${idx + 1}`}
              className="w-full h-full object-contain"
            />
            {!isDisabled && (
              <button
                onClick={() => onRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        
        {canAddMoreImages && !isDisabled && (
          <div
            className="flex items-center justify-center aspect-square bg-muted/30 rounded cursor-pointer border-2 border-dashed border-border"
            onClick={onAddImageClick}
          >
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="text-center text-xs text-muted-foreground">
        {images.length} / {maxImages} {t('image.imagesCount')}
        {images.length === 0 && (
          <p className="mt-1">{t('image.selectUpTo')} {maxImages} {t('image.imagesForHypnotic')}</p>
        )}
      </div>
      
      {canAddMoreImages && !isDisabled && (
        <div className="flex justify-center mt-2">
          <button 
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
            onClick={onAddImageClick}
            disabled={isDisabled}
          >
            {language === 'en' ? 'Upload from PC' : 'Subir desde PC'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleImagesGrid;
