
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="w-full py-2 md:py-3 px-4 md:px-6 bg-black/40 dark:bg-card/40 backdrop-blur-lg shadow-sm z-50 fixed top-0 left-0 right-0 border-b border-purple-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-1">
          <div className="relative w-8 h-8 md:w-9 md:h-9">
            <div className="absolute inset-0 bg-quantum-gradient rounded-full animate-pulse-soft opacity-80"></div>
            <div className="absolute inset-1 bg-black/50 dark:bg-card/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="neon-text text-quantum-primary font-bold text-sm md:text-base">Q</span>
            </div>
          </div>
          <span className="text-lg md:text-xl font-bold holographic-gradient">
            QuantumSync
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 md:gap-6">
          <Link to="/about" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
            Nosotros
          </Link>
          <Link to="/diagnose" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
            Diagnóstico
          </Link>
          <Link to="/treat" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
            Tratamiento
          </Link>
          <Link to="/manifest" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
            Manifestación
          </Link>
          <Link to="/affiliate" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
            Afiliados
          </Link>
          <Button className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-4 py-1 md:px-5 md:py-2 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] transition-all duration-300 text-sm">
            Comenzar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden neon-text" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 dark:bg-card/80 backdrop-blur-lg shadow-md py-3 px-4 flex flex-col gap-3 border-t border-purple-500/30">
          <Link 
            to="/about" 
            className="neon-text hover:text-primary transition-colors py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link 
            to="/diagnose" 
            className="neon-text hover:text-primary transition-colors py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            Diagnóstico
          </Link>
          <Link 
            to="/treat" 
            className="neon-text hover:text-primary transition-colors py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            Tratamiento
          </Link>
          <Link 
            to="/manifest" 
            className="neon-text hover:text-primary transition-colors py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            Manifestación
          </Link>
          <Link 
            to="/affiliate" 
            className="neon-text hover:text-primary transition-colors py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            Afiliados
          </Link>
          <Button 
            className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-4 py-2 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] w-full transition-all duration-300 text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Comenzar
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
