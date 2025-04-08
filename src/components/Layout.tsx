
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isMobile, isIOS } = useIsMobile();
  
  // Add viewport meta tag adjustments for iOS devices
  useEffect(() => {
    if (isIOS) {
      // Prevent unwanted zoom on iOS devices
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Add iOS safe area padding
      document.body.classList.add('ios-device');
    }
    
    return () => {
      if (isIOS) {
        document.body.classList.remove('ios-device');
      }
    };
  }, [isIOS]);
  
  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black bg-fixed ${isIOS ? 'ios-safe-area' : ''}`}>
      {/* Capa de estrellas */}
      <div className="absolute inset-0 z-0 bg-[url('/img/quantum-bg.webp')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen"></div>
      
      {/* Nebulosa central */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent opacity-70"></div>
      
      <Navbar />
      <main className={`flex-grow w-full pt-16 pb-8 md:pt-20 md:pb-16 relative z-10 ${isIOS ? 'ios-content-padding' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
