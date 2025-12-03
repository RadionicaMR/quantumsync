import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full py-1 md:py-2 px-3 md:px-4 bg-black/40 dark:bg-card/40 backdrop-blur-lg shadow-sm z-50 fixed top-0 left-0 right-0 border-b border-purple-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl md:text-2xl font-bold holographic-gradient">
            QuantumSync
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 md:gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/diagnose" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
                {t('nav.diagnosis')}
              </Link>
              <Link to="/balance-chakras" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
                {t('nav.balanceChakras')}
              </Link>
              <Link to="/treat" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
                {t('nav.treatment')}
              </Link>
              <Link to="/manifestation" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
                {t('nav.manifest')}
              </Link>
              <Link to="/affiliate" className="neon-text hover:text-primary transition-colors text-sm md:text-base">
                {t('nav.affiliates')}
              </Link>
              <LanguageToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-blue-500/10">
                    <User size={18} />
                    {user?.name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border border-border">
                  <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/session-history')}>
                    {t('nav.sessionHistory')}
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      {t('nav.adminPanel')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <LanguageToggle />
              <Link to="/login">
                <Button variant="outline" className="rounded-full flex items-center gap-2">
                  <LogIn size={18} />
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/purchase">
                <Button className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-4 py-1 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] transition-all duration-300 text-sm">
                  {t('nav.start')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <button 
            className="neon-text" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 dark:bg-card/80 backdrop-blur-lg shadow-md py-2 px-3 flex flex-col gap-2 border-t border-purple-500/30">
          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-600/20 p-1 rounded-full">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-white">{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut size={16} />
                </Button>
              </div>
              <Link 
                to="/diagnose" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.diagnosis')}
              </Link>
              <Link 
                to="/balance-chakras" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.balanceChakras')}
              </Link>
              <Link 
                to="/treat" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.treatment')}
              </Link>
              <Link 
                to="/manifestation" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.manifest')}
              </Link>
              <Link 
                to="/affiliate" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.affiliates')}
              </Link>
              <Link 
                to="/session-history" 
                className="neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.sessionHistory')}
              </Link>
              {user?.isAdmin && (
                <Link 
                  to="/admin" 
                  className="neon-text hover:text-primary transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.adminPanel')}
                </Link>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center gap-2 neon-text hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                {t('nav.login')}
              </Link>
              <Link 
                to="/purchase"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button 
                  className="rounded-full bg-gradient-to-r from-purple-600/70 to-blue-500/70 backdrop-blur-md border border-white/20 text-white font-medium px-3 py-1 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.7)] w-full transition-all duration-300 text-xs"
                >
                  {t('nav.start')}
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
