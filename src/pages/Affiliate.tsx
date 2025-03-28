
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Affiliate = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application Submitted",
        description: "We'll review your application and get back to you soon!",
      });
      setEmail('');
      setName('');
    }, 1500);
  };

  return (
    <Layout>
      <HeroSection
        title="Affiliate Program"
        subtitle="Transform lives and generate income by sharing QuantumSync with your audience."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Generate Income While Helping Others</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync isn't just a tool to transform lives—it's also an opportunity to generate income. Our compensation plan is designed to reward your efforts in promoting the application, creating a fair and scalable model.
              </p>
              <p className="text-muted-foreground mb-6">
                As a direct affiliate, you earn $4 for each sale you make. For each affiliate you invite, you receive $3 for each sale they make. Plus, you earn $2 for each sale from second-level affiliates and $1 for each sale from the third level.
              </p>
              <p className="text-muted-foreground mb-6">
                This model not only incentivizes direct sales but also encourages building strong teams. The more people you invite and the more your levels expand, the higher your monthly income will be. All this with an accessible subscription and a product that sells itself.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold mb-6">Compensation Structure</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-quantum-gradient flex items-center justify-center text-white flex-shrink-0">
                      $4
                    </div>
                    <div>
                      <h4 className="font-semibold">Direct Sales</h4>
                      <p className="text-muted-foreground">For every direct sale you make</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-quantum-gradient flex items-center justify-center text-white flex-shrink-0">
                      $3
                    </div>
                    <div>
                      <h4 className="font-semibold">First Level</h4>
                      <p className="text-muted-foreground">For every sale made by your direct affiliates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-quantum-gradient flex items-center justify-center text-white flex-shrink-0">
                      $2
                    </div>
                    <div>
                      <h4 className="font-semibold">Second Level</h4>
                      <p className="text-muted-foreground">For every sale made by your second level affiliates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-quantum-gradient flex items-center justify-center text-white flex-shrink-0">
                      $1
                    </div>
                    <div>
                      <h4 className="font-semibold">Third Level</h4>
                      <p className="text-muted-foreground">For every sale made by your third level affiliates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Example Income Scenarios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the potential earnings as your affiliate network grows.
            </p>
          </div>
          
          <Tabs defaultValue="month1" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="month1">Month 1</TabsTrigger>
              <TabsTrigger value="month2">Month 2</TabsTrigger>
              <TabsTrigger value="month3">Month 3</TabsTrigger>
            </TabsList>
            
            <TabsContent value="month1">
              <Card className="quantum-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">First Month</h3>
                    <div className="text-3xl font-bold text-quantum-primary mb-2">$1,020</div>
                    <div className="quantum-divider my-4"></div>
                    <p className="text-muted-foreground mb-4">
                      In your first month, you begin by making direct sales and inviting your first affiliates.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          30
                        </div>
                        <div>
                          <h4 className="font-semibold">Direct Sales</h4>
                          <p className="text-muted-foreground mb-1">30 x $4 = $120</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/30 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          10
                        </div>
                        <div>
                          <h4 className="font-semibold">First Level Affiliates</h4>
                          <p className="text-muted-foreground mb-1">10 affiliates x 30 sales each x $3 = $900</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/50 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          0
                        </div>
                        <div>
                          <h4 className="font-semibold">Second Level Affiliates</h4>
                          <p className="text-muted-foreground mb-1">Not yet established</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/70 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="month2">
              <Card className="quantum-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">Second Month</h3>
                    <div className="text-3xl font-bold text-quantum-primary mb-2">$7,020</div>
                    <div className="quantum-divider my-4"></div>
                    <p className="text-muted-foreground mb-4">
                      Your network expands as your first level affiliates begin to recruit their own teams.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          30
                        </div>
                        <div>
                          <h4 className="font-semibold">Direct Sales</h4>
                          <p className="text-muted-foreground mb-1">30 x $4 = $120</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/30 rounded-full" style={{ width: '2%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          10
                        </div>
                        <div>
                          <h4 className="font-semibold">First Level Affiliates</h4>
                          <p className="text-muted-foreground mb-1">10 affiliates x 30 sales each x $3 = $900</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/50 rounded-full" style={{ width: '13%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          100
                        </div>
                        <div>
                          <h4 className="font-semibold">Second Level Affiliates</h4>
                          <p className="text-muted-foreground mb-1">100 affiliates x 30 sales each x $2 = $6,000</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/70 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="month3">
              <Card className="quantum-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">Third Month</h3>
                    <div className="text-3xl font-bold text-quantum-primary mb-2">$37,020</div>
                    <div className="quantum-divider my-4"></div>
                    <p className="text-muted-foreground mb-4">
                      Your network reaches its third level, dramatically increasing your passive income.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          30
                        </div>
                        <div>
                          <h4 className="font-semibold">Previous Levels Income</h4>
                          <p className="text-muted-foreground mb-1">Direct + First level + Second level = $7,020</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/40 rounded-full" style={{ width: '19%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold flex-shrink-0">
                          1000
                        </div>
                        <div>
                          <h4 className="font-semibold">Third Level Affiliates</h4>
                          <p className="text-muted-foreground mb-1">1,000 affiliates x 30 sales each x $1 = $30,000</p>
                          <div className="w-full h-2 bg-muted/50 rounded-full">
                            <div className="h-full bg-quantum-primary/80 rounded-full" style={{ width: '81%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-quantum-gradient-soft rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Recurring Income:</span> Remember that these earnings are recurring as subscriptions renew monthly, creating a sustainable income stream.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="quantum-card p-6">
                <h3 className="text-xl font-semibold mb-4">Apply to Become an Affiliate</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        className="quantum-input mt-1" 
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        className="quantum-input mt-1" 
                        placeholder="Your email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <QuantumButton 
                      type="submit"
                      className="w-full mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Apply Now'}
                    </QuantumButton>
                    
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      By applying, you agree to our affiliate terms and conditions.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Why Become an Affiliate?</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-quantum-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Recurring Revenue</h4>
                    <p className="text-muted-foreground">
                      Earn passive income from subscription renewals month after month.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-quantum-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Multi-Level Earnings</h4>
                    <p className="text-muted-foreground">
                      Benefit from the success of your network through three levels of commissions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-quantum-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Proven Product</h4>
                    <p className="text-muted-foreground">
                      Promote a unique, valuable application that genuinely helps people.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-quantum-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Marketing Support</h4>
                    <p className="text-muted-foreground">
                      Access promotional materials, tracking tools, and affiliate resources.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-quantum-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Community Impact</h4>
                    <p className="text-muted-foreground">
                      Help others transform their lives while building your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80">
            Join our affiliate program today and start building a sustainable income while helping others transform their lives.
          </p>
          <button className="bg-white text-quantum-primary font-medium px-6 py-3 rounded-full shadow-lg hover:bg-white/90 transition-colors">
            Become an Affiliate
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Affiliate;
