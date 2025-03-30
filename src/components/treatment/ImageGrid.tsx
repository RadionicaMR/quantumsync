import ImageUploader from './image-uploader/ImageUploader';

interface ImageGridProps {
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  isPlaying: boolean;
}

const ImageGrid = ({
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  isPlaying,
}: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <ImageUploader
        title="GRÁFICO RADIÓNICO"
        subtitle="Subir Gráfico Radiónico"
        image={radionicImage}
        setImage={setRadionicImage}
        images={radionicImages}
        setImages={setRadionicImages}
        isPlaying={isPlaying}
        maxImages={3}
      />
      
      <ImageUploader
        title="RECEPTOR"
        subtitle="Subir Imagen del Receptor"
        image={receptorImage}
        setImage={setReceptorImage}
        images={receptorImages}
        setImages={setReceptorImages}
        isPlaying={isPlaying}
        maxImages={3}
      />
    </div>
  );
};

export default ImageGrid;
