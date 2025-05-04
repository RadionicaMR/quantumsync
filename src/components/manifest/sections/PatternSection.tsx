
import React, { memo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ImageUploader from '../ImageUploader';

interface PatternSectionProps {
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  isManifestActive: boolean;
}

const PatternSection = memo(({ 
  patternImage, 
  setPatternImage, 
  patternImages, 
  setPatternImages, 
  isManifestActive 
}: PatternSectionProps) => {
  // Log state for debugging
  useEffect(() => {
    console.log("PatternSection - Estado actualizado:", {
      patternImage,
      patternImagesCount: patternImages ? patternImages.length : 0,
      hasPattern: !!patternImage || (patternImages && patternImages.length > 0),
      patternImages
    });
  }, [patternImage, patternImages]);

  return (
    <Card className="p-6 quantum-card">
      <h3 className="text-lg font-semibold mb-4">Patrón de Manifestación</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Subir Imágenes de Patrón</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Sube imágenes que representen el patrón energético que deseas manifestar
          </p>
          
          <ImageUploader 
            imageUrl={patternImage}
            setImageUrl={setPatternImage}
            imageUrls={patternImages}
            setImageUrls={setPatternImages}
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

PatternSection.displayName = 'PatternSection';

export default PatternSection;
