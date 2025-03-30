
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black bg-fixed">
      {/* Capa de estrellas */}
      <div className="absolute inset-0 z-0 bg-[url('/img/quantum-bg.webp')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen"></div>
      
      {/* Nebulosa central */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent opacity-70"></div>
      
      <Navbar />
      <main className="flex-grow w-full pt-8 pb-8 md:pt-16 md:pb-16 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
