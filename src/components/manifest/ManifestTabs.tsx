
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ManifestTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ManifestTabs = ({ activeTab, onTabChange }: ManifestTabsProps) => {
  return (
    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
      <TabsTrigger value="presets" onClick={() => onTabChange("presets")}>
        Patrones Predefinidos
      </TabsTrigger>
      <TabsTrigger value="custom" onClick={() => onTabChange("custom")}>
        Manifestación Personal
      </TabsTrigger>
    </TabsList>
  );
};

export default ManifestTabs;
