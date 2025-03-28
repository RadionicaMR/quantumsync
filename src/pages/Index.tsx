
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Yoga Instructor",
      content: "QuantumSync has transformed my approach to energy healing. My clients notice the difference immediately after incorporating these frequencies.",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Michael Chen",
      role: "Holistic Therapist",
      content: "As someone who's been practicing energy work for years, QuantumSync has added a new dimension to my practice. It's intuitive and surprisingly powerful.",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "Wellness Coach",
      content: "I was skeptical at first, but after just two weeks of using QuantumSync, I've experienced deeper meditation and better sleep. My clients love it too!",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Energy Diagnosis",
      description: "Identify energetic imbalances using our virtual pendulum and intuitive interface."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Vibrational Treatment",
      description: "Apply precise frequency patterns to balance and harmonize your energy field."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Goal Manifestation",
      description: "Set clear intentions with our radionic tools to attract what you truly desire."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Personalized Programs",
      description: "Create custom protocols for sleep, stress, focus, and more to fit your unique needs."
    }
  ];

  const benefitItems = [
    {
      title: "Sleep Better",
      description: "Delta frequencies help you achieve deeper, more restorative sleep."
    },
    {
      title: "Reduce Stress",
      description: "Theta waves induce calm and serenity, melting away anxiety."
    },
    {
      title: "Improve Focus",
      description: "Beta frequencies enhance concentration and mental clarity."
    },
    {
      title: "Balance Emotions",
      description: "Targeted vibrations help stabilize emotional responses."
    },
    {
      title: "Boost Energy",
      description: "Revitalize your body and mind with specific energy patterns."
    },
    {
      title: "Clear Spaces",
      description: "Remove negative energy from your home or workspace."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        title="Transform Your Life Through Quantum Frequency Technology"
        subtitle="QuantumSync combines science, technology, and wellness to help you balance your energy and achieve your goals."
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <QuantumButton size="lg">Get Started</QuantumButton>
          <QuantumButton variant="outline" size="lg">Learn More</QuantumButton>
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Tools at Your Fingertips</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync offers advanced radionic technology that was once only available to specialists, now accessible through your mobile device.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About QuantumSync</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync is more than a technology company; we're a team committed to making well-being accessible to all. We combine cutting-edge innovation with spiritual principles to create solutions that positively impact people's lives.
              </p>
              <p className="text-muted-foreground mb-6">
                Our essence lies in integrating advanced technology with traditional and modern knowledge about energy and vibrations. We know that energy is the foundation of everything in the universe, and QuantumSync gives you the chance to connect with it in a practical and effective way.
              </p>
              <QuantumButton>Learn About Our Mission</QuantumButton>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="People using QuantumSync" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience Real Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync offers tangible improvements across multiple areas of your life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitItems.map((benefit, index) => (
              <Card key={index} className="quantum-card p-6">
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Mauricio Ramos - Founder" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Meet Our Founder</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                Behind every great idea is a creative and visionary mind. At QuantumSync, that mind belongs to Mauricio Ramos, a psychologist and expert in interpersonal communication and wellness technologies.
              </p>
              <p className="text-muted-foreground mb-6">
                Mauricio has dedicated his career to understanding how energy and intention can transform lives. For many years, he studied and manufactured classic radionic equipment, introducing modifications and improvements to each design he created and built.
              </p>
              <p className="text-muted-foreground mb-6">
                The idea for QuantumSync was born from his desire to unite science, technology, and spirituality in a practical and accessible solution. Mauricio saw the opportunity to leverage radionics and vibrational frequencies to create a tool that anyone could use, regardless of their experience level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how QuantumSync is transforming lives around the world.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTab === index ? 'bg-quantum-primary w-6' : 'bg-quantum-primary/30'}`}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </div>
          
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTab * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <Card className="quantum-card p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quantum-primary">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                        <p className="text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-lg italic text-muted-foreground">"{testimonial.content}"</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Program Section */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Join Our Affiliate Program</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync is not just a tool to transform your life, but also an opportunity to generate income. Our compensation plan is designed to reward your efforts in promoting the application, creating a fair and scalable model.
              </p>
              <p className="text-muted-foreground mb-6">
                As a direct user, you earn $4 for each sale you make. For each affiliate you invite, you receive $3 for each sale they make. Plus, you earn $2 for each sale from second-level affiliates and $1 for each sale from the third level.
              </p>
              <QuantumButton>Become an Affiliate</QuantumButton>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Example Monthly Income</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-quantum-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-medium">First Month: $1,020</p>
                      <p className="text-sm text-muted-foreground">30 direct sales ($120) + 10 affiliates with 30 sales each ($900)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-quantum-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Second Month: $7,020</p>
                      <p className="text-sm text-muted-foreground">Continued first month income + 100 second-level affiliates with 30 sales each ($6,000)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-quantum-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-medium">Third Month: $37,020</p>
                      <p className="text-sm text-muted-foreground">Previous income + 1,000 third-level affiliates with 30 sales each ($30,000)</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-quantum-gradient text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80">
            Download QuantumSync today and begin your journey to improved well-being, balanced energy, and new possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-quantum-primary font-medium px-6 py-3 rounded-full shadow-lg hover:bg-white/90 transition-colors">
              Download Now
            </button>
            <button className="border-2 border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
