
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-6 bg-black/40 dark:bg-card/40 backdrop-blur-lg shadow-sm z-50 fixed top-0 left-0 right-0 border-b border-purple-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-quantum-gradient rounded-full animate-pulse-soft opacity-80"></div>
            <div className="absolute inset-1 bg-black/50 dark:bg-card/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="neon-text text-quantum-primary font-bold text-lg">Q</span>
            </div>
          </div>
          <span className="text-xl font-bold holographic-gradient">
            QuantumSync
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="neon-text hover:text-primary transition-colors">
            Nosotros
          </Link>
          <Link to="/diagnose" className="neon-text hover:text-primary transition-colors">
            Diagnóstico
          </Link>
          <Link to="/treat" className="neon-text hover:text-primary transition-colors">
            Tratamiento
          </Link>
          <Link to="/manifest" className="neon-text hover:text-primary transition-colors">
            Manifestación
          </Link>
          <Link to="/affiliate" className="neon-text hover:text-primary transition-colors">
            Afiliados
          </Link>
          <Button className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-6 py-3 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] transition-all duration-300">
            Comenzar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden neon-text" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 dark:bg-card/80 backdrop-blur-lg shadow-md py-4 px-4 flex flex-col gap-4 border-t border-purple-500/30">
          <Link 
            to="/about" 
            className="neon-text hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link 
            to="/diagnose" 
            className="neon-text hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Diagnóstico
          </Link>
          <Link 
            to="/treat" 
            className="neon-text hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Tratamiento
          </Link>
          <Link 
            to="/manifest" 
            className="neon-text hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Manifestación
          </Link>
          <Link 
            to="/affiliate" 
            className="neon-text hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Afiliados
          </Link>
          <Button 
            className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-6 py-3 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] w-full transition-all duration-300"
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
