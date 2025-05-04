
import { TabsContent } from '@/components/ui/tabs';
import PresetManifest from '@/components/manifest/PresetManifest';
import CustomManifest from '@/components/manifest/CustomManifest';
import { ManifestPattern } from '@/data/manifestPatterns';
import { ManifestCoreProps } from '@/types/manifest';
import { memo } from 'react';

interface ManifestTabsContentProps extends ManifestCoreProps {
  activeTab: string;
  patterns: ManifestPattern[];
}

// Use memo to prevent unnecessary re-renders
const ManifestTabsContent = memo(({
  activeTab,
  patterns,
  ...coreProps
}: ManifestTabsContentProps) => {
  // Make sure the currentImage type is correct for both tabs
  const { currentImage } = coreProps;
  
  return (
    <>
      <TabsContent value="presets" className="w-full">
        <PresetManifest
          patterns={patterns}
          {...coreProps}
        />
      </TabsContent>
      
      <TabsContent value="custom" className="w-full">
        <CustomManifest
          patterns={patterns}
          {...coreProps}
          // Add required props that were missing
          audioLoop={coreProps.audioLoop || false}
          setAudioLoop={coreProps.setAudioLoop || (() => {})}
          clearAudio={coreProps.clearAudio || (() => {})}
        />
      </TabsContent>
    </>
  );
});

ManifestTabsContent.displayName = 'ManifestTabsContent';

export default ManifestTabsContent;
