
import React from 'react';
import ImageUploader from '../ImageUploader';
import ReceptorNameInput from '../ReceptorNameInput';

interface ReceptorSectionProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  isManifestActive: boolean;
}

const ReceptorSection = ({
  receptorName,
  setReceptorName,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  isManifestActive
}: ReceptorSectionProps) => {
  return (
    <div>
      <div className="mb-6">
        <ReceptorNameInput 
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          isActive={isManifestActive}
        />
      </div>
      
      <div>
        <ImageUploader
          label="Imagen del RECEPTOR"
          image={receptorImage}
          setImage={setReceptorImage}
          isDisabled={isManifestActive}
          description="Selecciona una imagen relacionada con tu objetivo"
          isMultiple={true}
          images={receptorImages}
          setImages={setReceptorImages}
          maxImages={3}
        />
      </div>
    </div>
  );
};

export default ReceptorSection;
