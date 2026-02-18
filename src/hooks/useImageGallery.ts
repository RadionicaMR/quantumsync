import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, GalleryCategory } from '@/types/gallery';
import { toast } from 'sonner';

const FETCH_TIMEOUT_MS = 15000; // 15 second timeout
const MAX_RETRIES = 2;

export const useImageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('image_gallery')
        .select('folder_name')
        .eq('is_active', true)
        .not('folder_name', 'is', null);
      
      if (error) throw error;
      
      if (data && isMountedRef.current) {
        const uniqueFolders = [...new Set(data.map(item => item.folder_name).filter(Boolean) as string[])];
        setFolders(uniqueFolders.sort());
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  const fetchGalleryImages = useCallback(async (category?: GalleryCategory, folderFilter?: string, retryCount = 0) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    
    // Set a timeout to prevent Safari from hanging indefinitely
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);
    
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
      
      clearTimeout(timeoutId);
      
      // Check if this request was aborted or component unmounted
      if (controller.signal.aborted || !isMountedRef.current) return;
      
      if (error) throw error;
      
      if (data) {
        const imagesWithUrls: GalleryImage[] = data.map(img => ({
          ...img,
          category: img.category as 'radionic' | 'pattern' | 'receptor' | 'chakra',
          url: supabase.storage.from('image-gallery').getPublicUrl(img.file_path).data.publicUrl
        }));
        setImages(imagesWithUrls);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (!isMountedRef.current) return;
      
      // Retry on timeout or network error (Safari specific)
      if (retryCount < MAX_RETRIES && (error?.name === 'AbortError' || error?.message?.includes('network'))) {
        console.warn(`Gallery fetch attempt ${retryCount + 1} failed, retrying...`);
        // Small delay before retry
        await new Promise(r => setTimeout(r, 500 * (retryCount + 1)));
        if (isMountedRef.current) {
          return fetchGalleryImages(category, folderFilter, retryCount + 1);
        }
        return;
      }
      
      console.error('Error fetching gallery images:', error);
      if (error?.name !== 'AbortError') {
        toast.error('Error al cargar las imágenes. Intenta de nuevo.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchFolders();
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFolders]);

  useEffect(() => {
    fetchGalleryImages(selectedCategory, selectedFolder);
  }, [selectedCategory, selectedFolder, fetchGalleryImages]);

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
