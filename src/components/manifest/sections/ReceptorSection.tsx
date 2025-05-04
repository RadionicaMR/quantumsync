
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
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

const ReceptorSection = memo(({ 
  receptorName, 
  setReceptorName, 
  receptorImage, 
  setReceptorImage, 
  receptorImages, 
  setReceptorImages, 
  isManifestActive 
}: ReceptorSectionProps) => {
  return (
    <Card className="p-6 quantum-card">
      <h3 className="text-lg font-semibold mb-4">Receptor de Manifestación</h3>
      
      <div className="space-y-4">
        <ReceptorNameInput 
          receptorName={receptorName} 
          setReceptorName={setReceptorName}
          isActive={isManifestActive}
        />
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Sube imágenes que representen el receptor de tu manifestación (opcional)
          </p>
          
          <ImageUploader 
            imageUrl={receptorImage}
            setImageUrl={setReceptorImage}
            imageUrls={receptorImages}
            setImageUrls={setReceptorImages}
            disabled={isManifestActive}
            allowMultiple={true}
            aspectRatio="square"
            maxFiles={10}
          />
        </div>
      </div>
    </Card>
  );
});

ReceptorSection.displayName = 'ReceptorSection';

export default ReceptorSection;
