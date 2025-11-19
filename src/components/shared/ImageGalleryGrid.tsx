import { GalleryImage } from '@/types/gallery';
import { Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryGridProps {
  images: GalleryImage[];
  selectedImages: string[];
  onImageSelect: (imageUrl: string) => void;
  loading: boolean;
  multiSelect: boolean;
}

const ImageGalleryGrid = ({
  images,
  selectedImages,
  onImageSelect,
  loading,
  multiSelect
}: ImageGalleryGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay imágenes en esta categoría
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => {
        const isSelected = selectedImages.includes(image.url || '');
        return (
          <div
            key={image.id}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
              isSelected ? 'border-primary shadow-lg' : 'border-border'
            }`}
            onClick={() => image.url && onImageSelect(image.url)}
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary rounded-full p-2">
                  <Check className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-sm font-medium truncate">{image.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGalleryGrid;
