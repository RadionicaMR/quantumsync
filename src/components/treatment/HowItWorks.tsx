import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('howItWorks.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{t('howItWorks.step1Title')}</h3>
            <p className="text-muted-foreground text-center">
              {t('howItWorks.step1Desc')}
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{t('howItWorks.step2Title')}</h3>
            <p className="text-muted-foreground text-center">
              {t('howItWorks.step2Desc')}
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{t('howItWorks.step3Title')}</h3>
            <p className="text-muted-foreground text-center">
              {t('howItWorks.step3Desc')}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
