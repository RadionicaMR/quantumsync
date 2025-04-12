
import React, { useRef } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

interface SingleImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  isDisabled: boolean;
  placeholder: string;
  inputId: string;
}

const SingleImageUploader = ({ 
  image, 
  onImageChange, 
  isDisabled,
  placeholder,
  inputId
}: SingleImageUploaderProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <>
      {image ? (
        <div className="relative">
          <img 
            src={image}
            alt="Uploaded image"
            className="max-h-40 mx-auto object-contain rounded"
          />
          {!isDisabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="py-8">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">{placeholder}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Arrastra o selecciona una imagen
          </p>
          <div className="mt-4 flex justify-center">
            <button 
              className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(inputId)?.click();
              }}
              disabled={isDisabled}
            >
              Subir desde PC
            </button>
          </div>
        </div>
      )}
      <input
        id={inputId}
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        disabled={isDisabled}
      />
    </>
  );
};

export default SingleImageUploader;
