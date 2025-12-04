import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, TrendingUp, Link } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const AffiliateSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const cards = [
    {
      icon: DollarSign,
      color: 'text-green-500',
      titleKey: 'home.affiliateCommission',
      descKey: 'home.affiliateCommissionDesc'
    },
    {
      icon: Users,
      color: 'text-blue-500',
      titleKey: 'home.affiliateTracking',
      descKey: 'home.affiliateTrackingDesc'
    },
    {
      icon: TrendingUp,
      color: 'text-purple-500',
      titleKey: 'home.affiliateDashboard',
      descKey: 'home.affiliateDashboardDesc'
    },
    {
      icon: Link,
      color: 'text-orange-500',
      titleKey: 'home.affiliatePayments',
      descKey: 'home.affiliatePaymentsDesc'
    }
  ];
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('home.affiliateTitle')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('home.affiliateSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {cards.map((card, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <card.icon className={`h-12 w-12 ${card.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2">{t(card.titleKey)}</h3>
              <p className="text-muted-foreground">
                {t(card.descKey)}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center space-x-4">
          <Button size="lg" onClick={() => navigate('/affiliate-register')}>
            {t('home.affiliateJoin')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/affiliate-login')}>
            {t('home.affiliateAlready')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AffiliateSection;