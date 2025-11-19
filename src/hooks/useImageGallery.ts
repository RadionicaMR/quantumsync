import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, GalleryCategory } from '@/types/gallery';
import { toast } from 'sonner';

export const useImageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');

  const fetchGalleryImages = async (category?: GalleryCategory) => {
    setLoading(true);
    try {
      let query = supabase
        .from('image_gallery')
        .select('*')
        .eq('is_active', true);
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
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
    fetchGalleryImages(selectedCategory);
  }, [selectedCategory]);

  return {
    images,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchGalleryImages,
    refreshGallery: () => fetchGalleryImages(selectedCategory)
  };
};
