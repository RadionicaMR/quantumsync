
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-6 bg-white/80 dark:bg-card/80 backdrop-blur-lg shadow-sm z-50 fixed top-0 left-0 right-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-quantum-gradient rounded-full animate-pulse-soft"></div>
            <div className="absolute inset-1 bg-white dark:bg-card rounded-full flex items-center justify-center">
              <span className="text-quantum-primary font-bold text-lg">Q</span>
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-quantum-gradient">
            QuantumSync
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            Nosotros
          </Link>
          <Link to="/diagnose" className="text-foreground/80 hover:text-primary transition-colors">
            Diagnóstico
          </Link>
          <Link to="/treat" className="text-foreground/80 hover:text-primary transition-colors">
            Tratamiento
          </Link>
          <Link to="/manifest" className="text-foreground/80 hover:text-primary transition-colors">
            Manifestación
          </Link>
          <Link to="/affiliate" className="text-foreground/80 hover:text-primary transition-colors">
            Afiliados
          </Link>
          <Button className="quantum-button">
            Comenzar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-card/95 backdrop-blur-lg shadow-md py-4 px-4 flex flex-col gap-4 border-t border-border">
          <Link 
            to="/about" 
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link 
            to="/diagnose" 
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Diagnóstico
          </Link>
          <Link 
            to="/treat" 
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Tratamiento
          </Link>
          <Link 
            to="/manifest" 
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Manifestación
          </Link>
          <Link 
            to="/affiliate" 
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Afiliados
          </Link>
          <Button 
            className="quantum-button w-full"
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
