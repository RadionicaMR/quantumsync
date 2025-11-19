
import ImageUploader from '../image-uploader/ImageUploader';

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
  // Combine isPlaying and isDisabled
  const disabled = isDisabled || isPlaying;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImageUploader
        title="Imagen del RECEPTOR"
        subtitle="Sujeto del tratamiento"
        image={receptorImage}
        setImage={setReceptorImage}
        images={receptorImages}
        setImages={setReceptorImages}
        isPlaying={disabled}
        category="receptor"
      />
      
      <ImageUploader
        title="Gráfico RADIÓNICO"
        subtitle="Patrones de tratamiento"
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
