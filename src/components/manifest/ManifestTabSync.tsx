
import { useState, useEffect } from 'react';

interface ManifestTabSyncProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  manifestActiveTab: string;
  setManifestActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const ManifestTabSync: React.FC<ManifestTabSyncProps> = ({
  activeTab,
  setActiveTab,
  manifestActiveTab,
  setManifestActiveTab,
  children
}) => {
  // Maintain synchronization when activeTab changes locally
  useEffect(() => {
    if (activeTab !== manifestActiveTab) {
      console.log("ManifestTabSync: Sync local -> hook:", {
        activeTabLocal: activeTab,
        activeTabState: manifestActiveTab
      });
      setManifestActiveTab(activeTab);
    }
  }, [activeTab, manifestActiveTab, setManifestActiveTab]);
  
  // Maintain synchronization when activeTab changes in the hook
  useEffect(() => {
    if (activeTab !== manifestActiveTab) {
      console.log("ManifestTabSync: Sync hook -> local:", {
        activeTabLocal: activeTab,
        activeTabState: manifestActiveTab
      });
      setActiveTab(manifestActiveTab);
    }
  }, [manifestActiveTab, activeTab, setActiveTab]);

  return <>{children}</>;
};

export default ManifestTabSync;
