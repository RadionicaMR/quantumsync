export type GalleryCategory = 'radionic' | 'pattern' | 'receptor' | 'chakra' | 'all';

export interface GalleryImage {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  category: 'radionic' | 'pattern' | 'receptor' | 'chakra';
  file_path: string;
  thumbnail_url: string | null;
  tags: string[] | null;
  uploaded_by: string | null;
  is_active: boolean;
  url?: string; // Public URL added after fetch
}

export interface ImageGalleryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrls: string[]) => void;
  category?: GalleryCategory;
  maxSelection?: number;
  multiSelect?: boolean;
}
