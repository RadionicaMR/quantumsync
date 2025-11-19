import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ImageGalleryDialogProps, GalleryCategory } from '@/types/gallery';
import { useImageGallery } from '@/hooks/useImageGallery';
import ImageGalleryGrid from './ImageGalleryGrid';
import { Search } from 'lucide-react';

const ImageGalleryDialog = ({
  isOpen,
  onClose,
  onSelect,
  category = 'all',
  maxSelection = 3,
  multiSelect = true
}: ImageGalleryDialogProps) => {
  const { images, loading, selectedCategory, setSelectedCategory } = useImageGallery();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleImageSelect = (imageUrl: string) => {
    if (multiSelect) {
      setSelectedImages(prev => {
        const isSelected = prev.includes(imageUrl);
        if (isSelected) {
          return prev.filter(url => url !== imageUrl);
        } else {
          if (prev.length >= maxSelection) {
            return prev;
          }
          return [...prev, imageUrl];
        }
      });
    } else {
      setSelectedImages([imageUrl]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    setSelectedImages([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedImages([]);
    onClose();
  };

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories: { value: GalleryCategory; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'radionic', label: 'Radiónicos' },
    { value: 'pattern', label: 'Patrones' },
    { value: 'receptor', label: 'Receptores' },
    { value: 'chakra', label: 'Chakras' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Biblioteca de Imágenes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Tabs value={selectedCategory} onValueChange={(val) => setSelectedCategory(val as GalleryCategory)}>
            <TabsList className="grid grid-cols-5 w-full">
              {categories.map(cat => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, descripción o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ImageGalleryGrid
              images={filteredImages}
              selectedImages={selectedImages}
              onImageSelect={handleImageSelect}
              loading={loading}
              multiSelect={multiSelect}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={selectedImages.length === 0}>
            Seleccionar ({selectedImages.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;
