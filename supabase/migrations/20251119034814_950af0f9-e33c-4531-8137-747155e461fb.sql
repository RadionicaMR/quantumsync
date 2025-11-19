-- Add folder_name column to image_gallery table
ALTER TABLE public.image_gallery 
ADD COLUMN folder_name text;

-- Add index for faster searching by folder
CREATE INDEX idx_image_gallery_folder_name ON public.image_gallery(folder_name);