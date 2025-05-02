
import React from 'react';
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
