
import React from 'react';
import ManifestationBox from './controls/ManifestationBox';
import { Card } from '@/components/ui/card';

interface ManifestationBoxAdapterProps {
  intention: string;
  setIntention: (value: string) => void;
  isActive?: boolean;
}

const ManifestationBoxAdapter: React.FC<ManifestationBoxAdapterProps> = ({
  intention,
  setIntention,
  isActive = false
}) => {
  return (
    <Card className="mb-6 p-4 quantum-card">
      <ManifestationBox 
        intention={intention}
        setIntention={setIntention}
        isDisabled={isActive}
      />
    </Card>
  );
};

export default ManifestationBoxAdapter;
