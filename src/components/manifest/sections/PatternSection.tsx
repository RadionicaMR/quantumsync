
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
  
  // Debug log para confirmar que los patrones se están estableciendo correctamente
  useEffect(() => {
    console.log("PatternSection - Estado actualizado:", {
      patternImage,
      patternImagesCount: patternImages.length,
      hasPattern: Boolean(patternImage !== null || patternImages.length > 0)
    });
  }, [patternImage, patternImages]);
  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Carga tu Patrón Radiónico</h3>
      <ImageUploader
        label="Subir Patrón Radiónico"
        image={patternImage}
        setImage={setPatternImage}
        isDisabled={isManifestActive}
        description="Sube tu propio diseño desde tu galería"
        isMultiple={true}
        images={patternImages}
        setImages={setPatternImages}
        maxImages={3}
      />
    </div>
  );
};

export default PatternSection;
