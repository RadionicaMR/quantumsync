import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useImageGallery } from '@/hooks/useImageGallery';
import { toast } from 'sonner';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ImageGalleryManagement = () => {
  const { images, loading, refreshGallery } = useImageGallery();
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'radionic' as 'radionic' | 'pattern' | 'receptor' | 'chakra',
    tags: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo debe ser menor a 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!formData.file || !formData.name) {
      toast.error('Por favor completa el nombre y selecciona una imagen');
      return;
    }

    setUploading(true);
    try {
      // Subir archivo a Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formData.category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('image-gallery')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Insertar metadatos en la tabla
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      
      const { error: insertError } = await supabase
        .from('image_gallery')
        .insert({
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          file_path: filePath,
          tags: tagsArray.length > 0 ? tagsArray : null
        });

      if (insertError) throw insertError;

      toast.success('Imagen subida exitosamente');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'radionic',
        tags: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      refreshGallery();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: typeof images[0]) => {
    try {
      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from('image-gallery')
        .remove([image.file_path]);

      if (storageError) throw storageError;

      // Eliminar de la tabla
      const { error: deleteError } = await supabase
        .from('image_gallery')
        .delete()
        .eq('id', image.id);

      if (deleteError) throw deleteError;

      toast.success('Imagen eliminada exitosamente');
      refreshGallery();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subir Nueva Imagen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Imagen *</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {formData.file && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.file.name} ({(formData.file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Flor de la Vida"
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData(prev => ({ ...prev, category: val as any }))}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radionic">Gráfico Radiónico</SelectItem>
                  <SelectItem value="pattern">Patrón</SelectItem>
                  <SelectItem value="receptor">Receptor</SelectItem>
                  <SelectItem value="chakra">Chakra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción opcional"
                rows={3}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="geometría sagrada, sanación, protección"
                disabled={uploading}
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={uploading || !formData.file || !formData.name}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Imágenes en la Galería ({images.length})</h3>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay imágenes en la galería</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeleteId(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="mt-1">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <p className="text-xs text-muted-foreground">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada permanentemente de la galería.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const image = images.find(img => img.id === deleteId);
                if (image) handleDelete(image);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageGalleryManagement;
