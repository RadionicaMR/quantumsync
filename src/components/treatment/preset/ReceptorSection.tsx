
import ReceptorNameInput from '../ReceptorNameInput';

interface ReceptorSectionProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying: boolean;
}

const ReceptorSection = ({
  receptorName,
  setReceptorName,
  isPlaying,
}: ReceptorSectionProps) => {
  return (
    <div className="mt-6">
      <ReceptorNameInput
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default ReceptorSection;
