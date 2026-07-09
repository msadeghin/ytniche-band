import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, TrendingUp, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/workflow', label: 'New Analysis' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-800/50 bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gradient">NicheBand</span>
              <span className="ml-2 text-xs text-muted-foreground">v6</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === link.path
                    ? 'text-white bg-dark-800'
                    : 'text-muted-foreground hover:text-white hover:bg-dark-800/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/workflow">
              <Button variant="gradient" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-dark-800"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-dark-800/50 bg-dark-950/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? 'text-white bg-dark-800'
                    : 'text-muted-foreground hover:text-white hover:bg-dark-800/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/workflow" onClick={() => setIsOpen(false)}>
                <Button variant="gradient" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
