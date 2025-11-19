-- Crear bucket público para la galería de imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('image-gallery', 'image-gallery', true);

-- RLS Policy: Permitir lectura a todos
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'image-gallery');

-- RLS Policy: Solo admins pueden subir
CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'image-gallery' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policy: Solo admins pueden eliminar
CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'image-gallery'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Crear tabla para metadatos de imágenes
CREATE TABLE public.image_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('radionic', 'pattern', 'receptor', 'chakra')),
  file_path TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  uploaded_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- RLS Policies para image_gallery
ALTER TABLE public.image_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery images"
ON public.image_gallery FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can insert gallery images"
ON public.image_gallery FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery images"
ON public.image_gallery FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images"
ON public.image_gallery FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));