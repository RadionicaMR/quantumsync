
import React, { useEffect } from 'react';
import ImageUploader from '../ImageUploader';

interface PatternSectionProps {
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  isManifestActive: boolean;
}

const PatternSection = ({
  patternImage,
  setPatternImage,
  patternImages,
  setPatternImages,
  isManifestActive
}: PatternSectionProps) => {
  
  // Verificar y registrar el estado del patrón cada vez que cambia
  useEffect(() => {
    console.log("PatternSection - Estado actualizado:", {
      patternImage,
      patternImagesCount: patternImages.length,
      hasPattern: Boolean(patternImage !== null || patternImages.length > 0)
    });
  }, [patternImage, patternImages]);
  
  const handleSetPatternImage = (image: string | null) => {
    console.log("PatternSection - Estableciendo imagen de patrón:", image);
    setPatternImage(image);
    
    // Si se limpia la imagen principal y no hay imágenes múltiples, alerta al usuario
    if (image === null && patternImages.length === 0) {
      console.warn("PatternSection - Advertencia: No hay imágenes de patrón disponibles");
    }
  };
  
  const handleSetPatternImages = (images: string[]) => {
    console.log("PatternSection - Estableciendo múltiples imágenes de patrón:", images.length);
    setPatternImages(images);
    
    // Si se eliminan todas las imágenes múltiples y no hay imagen principal, alerta al usuario
    if (images.length === 0 && patternImage === null) {
      console.warn("PatternSection - Advertencia: No hay imágenes de patrón disponibles");
    }
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Carga tu Patrón Radiónico</h3>
      <ImageUploader
        label="Subir Patrón Radiónico"
        image={patternImage}
        setImage={handleSetPatternImage}
        isDisabled={isManifestActive}
        description="Sube tu propio diseño desde tu galería"
        isMultiple={true}
        images={patternImages}
        setImages={handleSetPatternImages}
        maxImages={3}
      />
    </div>
  );
};

export default PatternSection;
