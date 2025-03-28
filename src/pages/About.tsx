
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      title: "Innovation",
      description: "We constantly push boundaries to create cutting-edge solutions that bridge science and spirituality."
    },
    {
      title: "Trust",
      description: "We build trust through transparency, reliability, and a deep commitment to our users' well-being."
    },
    {
      title: "Sustainability",
      description: "Our practices and products are designed with environmental and social responsibility in mind."
    },
    {
      title: "Positive Impact",
      description: "Everything we do aims to create positive change in individual lives and in the world as a whole."
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
      <HeroSection
        title="Our Mission & Vision"
        subtitle="At QuantumSync, we're dedicated to making energetic well-being accessible to everyone through innovative technology."
        align="center"
      />

      {/* Company Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">The QuantumSync Story</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync is more than a technology company; we're a team committed to making well-being accessible to all. We combine cutting-edge innovation with spiritual principles to create solutions that positively impact people's lives.
              </p>
              <p className="text-muted-foreground mb-6">
                Our essence lies in integrating advanced technology with traditional and modern knowledge about energy and vibrations. We know that energy is the foundation of everything in the universe, and QuantumSync gives you the chance to connect with it in a practical and effective way.
              </p>
              <p className="text-muted-foreground mb-6">
                With a global vision, we seek to bring our wellness proposition to millions of people worldwide. Our commitment is to offer technological tools that are easy to use, scientifically backed, and, above all, useful for anyone, regardless of their level of prior knowledge.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="QuantumSync technology" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="quantum-card p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <div className="quantum-divider w-16 my-4"></div>
              <p className="text-muted-foreground mb-6">
                The mission of QuantumSync is clear: to make energetic balance and personal well-being accessible through advanced and easy-to-use technology. We want anyone, from anywhere in the world, to be able to access tools that were previously exclusive to specialists.
              </p>
              <p className="text-muted-foreground">
                We believe that energy tools should be democratized, allowing everyone to take control of their own well-being without requiring years of specialized training.
              </p>
            </div>
            <div className="quantum-card p-8">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <div className="quantum-divider w-16 my-4"></div>
              <p className="text-muted-foreground mb-6">
                Our vision is to become global leaders in digital solutions for energetic well-being. This means not only creating an innovative application but also developing a global community that values the positive impact of energy in their lives.
              </p>
              <p className="text-muted-foreground">
                We envision a world where energetic tools are as common as fitness apps, where people routinely maintain their energetic health alongside their physical and mental well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at QuantumSync, from product development to customer interactions.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={item}>
                <Card className="quantum-card p-6 h-full">
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24">
                <div className="relative">
                  <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
                  <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                      alt="Mauricio Ramos - Founder" 
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold">Mauricio Ramos</h3>
                  <p className="text-muted-foreground">Founder & CEO</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">Our Founder's Journey</h2>
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
              <p className="text-muted-foreground mb-6">
                With a combination of knowledge in psychology, alternative or energetic therapies, and personal development, Mauricio has led QuantumSync with a clear vision: to empower people to take control of their energetic well-being. His commitment to innovation and accessibility has been the foundation of every strategic decision in the company.
              </p>
              <p className="text-muted-foreground mb-6">
                Mauricio is not just the founder of QuantumSync; he's also a passionate user of the application, which ensures that each feature is tested and perfected from the perspective of those who need it most.
              </p>
              <blockquote className="border-l-4 border-quantum-primary pl-4 italic text-muted-foreground my-8">
                "I believe that everyone deserves access to tools that can enhance their well-being. Technology should serve humanity by making powerful solutions accessible to all, not just to specialists or the privileged few."
                <footer className="text-foreground font-medium mt-2">— Mauricio Ramos</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Be part of our community and help us spread the benefits of energetic well-being to the world.
          </p>
          <QuantumButton size="lg">Download QuantumSync Today</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

export default About;
