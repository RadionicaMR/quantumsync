
import ImageUploader from './ImageUploader';

interface ImageGridProps {
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  isPlaying: boolean;
}

const ImageGrid = ({
  radionicImage,
  setRadionicImage,
  receptorImage,
  setReceptorImage,
  isPlaying,
}: ImageGridProps) => {
  return (
    <>
      <ImageUploader
        title="GRÁFICO RADIÓNICO"
        subtitle="Subir Gráfico Radiónico"
        image={radionicImage}
        setImage={setRadionicImage}
        isPlaying={isPlaying}
      />
      
      <ImageUploader
        title="RECEPTOR"
        subtitle="Subir Imagen del Receptor"
        image={receptorImage}
        setImage={setReceptorImage}
        isPlaying={isPlaying}
      />
    </>
  );
};

export default ImageGrid;
