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
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkCategory, setBulkCategory] = useState<'radionic' | 'pattern' | 'receptor' | 'chakra'>('radionic');
  
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

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede el límite de 5MB`);
        return false;
      }
      return true;
    });
    
    // Extract folder names from file paths
    const folders = new Set(
      validFiles
        .map(file => {
          const path = (file as any).webkitRelativePath || file.name;
          const parts = path.split('/');
          return parts.length > 1 ? parts[0] : null;
        })
        .filter(Boolean)
    );
    
    setBulkFiles(validFiles);
    if (folders.size > 0) {
      toast.success(`${validFiles.length} imágenes de ${folders.size} carpeta(s) seleccionadas`);
    } else {
      toast.success(`${validFiles.length} imágenes seleccionadas`);
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      toast.error('Por favor selecciona imágenes para subir');
      return;
    }

    setBulkUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of bulkFiles) {
      try {
        // Extraer el nombre de la carpeta y el nombre del archivo
        const filePath = (file as any).webkitRelativePath || file.name;
        const pathParts = filePath.split('/');
        const folderName = pathParts.length > 1 ? pathParts[0] : null;
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remover extensión
        
        const fileExt = file.name.split('.').pop();
        const storageFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const storagePath = `${bulkCategory}/${storageFileName}`;

        // Subir a Storage
        const { error: uploadError } = await supabase.storage
          .from('image-gallery')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Insertar metadatos incluyendo nombre de carpeta
        const { error: insertError } = await supabase
          .from('image_gallery')
          .insert({
            name: fileName,
            description: null,
            category: bulkCategory,
            file_path: storagePath,
            tags: folderName ? [folderName] : null,
            folder_name: folderName
          });

        if (insertError) throw insertError;
        successCount++;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errorCount++;
      }
    }

    setBulkUploading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} imágenes subidas exitosamente`);
      refreshGallery();
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} imágenes fallaron al subir`);
    }

    // Reset
    setBulkFiles([]);
    const fileInput = document.getElementById('bulk-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
      {/* Carga Masiva */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Carga Masiva de Imágenes
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bulk-category">Categoría para todas las imágenes *</Label>
            <Select
              value={bulkCategory}
              onValueChange={(val) => setBulkCategory(val as any)}
              disabled={bulkUploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="radionic">Filtros Radiónicos</SelectItem>
                <SelectItem value="pattern">Gráficos Radiónicos</SelectItem>
                <SelectItem value="receptor">Receptor</SelectItem>
                <SelectItem value="chakra">Chakra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="bulk-upload">Seleccionar carpeta con imágenes</Label>
            <Input
              id="bulk-upload"
              type="file"
              accept="image/*"
              onChange={handleBulkFileChange}
              disabled={bulkUploading}
              className="cursor-pointer"
              {...({ webkitdirectory: "", directory: "" } as any)}
            />
            {bulkFiles.length > 0 && (
              <div className="mt-2 p-3 bg-background/50 rounded-md">
                <p className="text-sm font-medium mb-2">
                  {bulkFiles.length} imágenes seleccionadas:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {bulkFiles.map((file, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={handleBulkUpload} 
            disabled={bulkUploading || bulkFiles.length === 0}
            className="w-full"
          >
            {bulkUploading ? (
              <>Subiendo {bulkFiles.length} imágenes...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir {bulkFiles.length > 0 ? `${bulkFiles.length} Imágenes` : 'Imágenes'}
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            💡 Selecciona una carpeta completa. Los nombres de las imágenes se tomarán de los archivos y el nombre de la carpeta se guardará para facilitar la búsqueda.
          </p>
        </div>
      </Card>

      {/* Subir imagen individual */}
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
                  <SelectItem value="radionic">Filtros Radiónicos</SelectItem>
                  <SelectItem value="pattern">Gráficos Radiónicos</SelectItem>
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
