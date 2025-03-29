
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="w-full py-1 md:py-2 px-3 md:px-4 bg-black/40 dark:bg-card/40 backdrop-blur-lg shadow-sm z-50 fixed top-0 left-0 right-0 border-b border-purple-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-base md:text-lg font-bold holographic-gradient">
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
          <Button className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-3 py-1 md:px-4 md:py-1 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] transition-all duration-300 text-xs md:text-sm">
            Comenzar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden neon-text" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 dark:bg-card/80 backdrop-blur-lg shadow-md py-2 px-3 flex flex-col gap-2 border-t border-purple-500/30">
          <Link 
            to="/about" 
            className="neon-text hover:text-primary transition-colors py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link 
            to="/diagnose" 
            className="neon-text hover:text-primary transition-colors py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Diagnóstico
          </Link>
          <Link 
            to="/treat" 
            className="neon-text hover:text-primary transition-colors py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Tratamiento
          </Link>
          <Link 
            to="/manifest" 
            className="neon-text hover:text-primary transition-colors py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Manifestación
          </Link>
          <Link 
            to="/affiliate" 
            className="neon-text hover:text-primary transition-colors py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Afiliados
          </Link>
          <Button 
            className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-3 py-1 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] w-full transition-all duration-300 text-xs"
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
