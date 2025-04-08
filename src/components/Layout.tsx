
import { ReactNode, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isMobile, isIOS, isSafari } = useIsMobile();
  
  // Aplicar optimizaciones específicas para Safari/iOS
  useEffect(() => {
    if (isIOS || isSafari) {
      // Viewport fixes para iOS
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Optimizaciones para scroll
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.overflowY = 'scroll';
      document.body.style.WebkitOverflowScrolling = 'touch';
      
      // Clases para iOS
      document.body.classList.add('ios-device');
      
      // Corrección para problemas de orientación en iOS
      const handleOrientation = () => {
        // Pequeño timeout para dar tiempo a que iOS actualice las dimensiones
        setTimeout(() => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
      };
      
      window.addEventListener('resize', handleOrientation, { passive: true });
      window.addEventListener('orientationchange', handleOrientation, { passive: true });
      
      // Ejecutar inicialmente
      handleOrientation();
      
      return () => {
        if (isIOS) {
          document.body.classList.remove('ios-device');
          window.removeEventListener('resize', handleOrientation);
          window.removeEventListener('orientationchange', handleOrientation);
        }
      };
    }
  }, [isIOS, isSafari]);
  
  // Usar useMemo para evitar cálculos repetidos en Safari
  const layoutClasses = useMemo(() => {
    return `flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black bg-fixed 
    ${isIOS ? 'ios-safe-area' : ''} 
    ${isSafari ? 'safari-optimized' : ''}`;
  }, [isIOS, isSafari]);
  
  // Usar useMemo para el contenido principal
  const mainClasses = useMemo(() => {
    return `flex-grow w-full pt-16 pb-8 md:pt-20 md:pb-16 relative z-10 
    ${isIOS ? 'ios-content-padding' : ''} 
    ${isSafari ? 'safari-momentum-scroll' : ''}`;
  }, [isIOS, isSafari]);
  
  return (
    <div className={layoutClasses}>
      {/* Usar will-change sparingly para mejorar rendimiento en Safari */}
      <div className="absolute inset-0 z-0 bg-[url('/img/quantum-bg.webp')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen" 
           style={{ willChange: 'opacity' }}></div>
      
      {/* Nebulosa central optimizada para Safari */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent opacity-70"
           style={{ willChange: 'opacity' }}></div>
      
      <Navbar />
      <main className={mainClasses}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
