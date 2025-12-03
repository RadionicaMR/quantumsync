import ImageUploader from '../image-uploader/ImageUploader';
import { useLanguage } from '@/context/LanguageContext';

interface ImageUploaderSectionProps {
  isPlaying: boolean;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  receptorName?: string;
  setReceptorName?: (name: string) => void;
  isDisabled?: boolean;
}

const ImageUploaderSection = ({
  isPlaying,
  radionicImage,
  setRadionicImage,
  receptorImage,
  setReceptorImage,
  radionicImages,
  setRadionicImages,
  receptorImages,
  setReceptorImages,
  receptorName,
  setReceptorName,
  isDisabled = false,
}: ImageUploaderSectionProps) => {
  const { t } = useLanguage();
  const disabled = isDisabled || isPlaying;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImageUploader
        title={t('image.receptorImage')}
        subtitle={t('image.treatmentSubject')}
        image={receptorImage}
        setImage={setReceptorImage}
        images={receptorImages}
        setImages={setReceptorImages}
        isPlaying={disabled}
        category="receptor"
      />
      
      <ImageUploader
        title={t('image.radionicGraphic')}
        subtitle={t('image.treatmentPatterns')}
        image={radionicImage}
        setImage={setRadionicImage}
        images={radionicImages}
        setImages={setRadionicImages}
        isPlaying={disabled}
        category="radionic"
      />
    </div>
  );
};

export default ImageUploaderSection;
