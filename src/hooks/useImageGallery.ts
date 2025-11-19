import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, GalleryCategory } from '@/types/gallery';
import { toast } from 'sonner';

export const useImageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('image_gallery')
        .select('folder_name')
        .eq('is_active', true)
        .not('folder_name', 'is', null);
      
      if (error) throw error;
      
      if (data) {
        const uniqueFolders = [...new Set(data.map(item => item.folder_name).filter(Boolean) as string[])];
        setFolders(uniqueFolders.sort());
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchGalleryImages = async (category?: GalleryCategory, folderFilter?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('image_gallery')
        .select('*')
        .eq('is_active', true);
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (folderFilter && folderFilter !== 'all') {
        query = query.eq('folder_name', folderFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Agregar URLs públicas de Storage y asegurar tipos correctos
        const imagesWithUrls: GalleryImage[] = data.map(img => ({
          ...img,
          category: img.category as 'radionic' | 'pattern' | 'receptor' | 'chakra',
          url: supabase.storage.from('image-gallery').getPublicUrl(img.file_path).data.publicUrl
        }));
        setImages(imagesWithUrls);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Error al cargar las imágenes de la galería');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchGalleryImages(selectedCategory, selectedFolder);
  }, [selectedCategory, selectedFolder]);

  return {
    images,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedFolder,
    setSelectedFolder,
    folders,
    fetchGalleryImages,
    refreshGallery: () => fetchGalleryImages(selectedCategory, selectedFolder)
  };
};
