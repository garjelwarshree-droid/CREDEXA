import React from 'react';
import { Link, useLocation } from 'wouter';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Moon, Sun, CreditCard, Search, Activity, Bookmark, LineChart, Info, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

const navItems = [
  { path: '/', label: 'Home', icon: CreditCard },
  { path: '/recommendations', label: 'AI Match', icon: Activity },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/compare', label: 'Compare', icon: LineChart },
  { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/about', label: 'About', icon: Info },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="cardsense-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">CardSense <span className="text-primary">AI</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"} 
                      className={`text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}
                      size="sm"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="ml-2 border-l border-border pl-2">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile Nav Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-border bg-background overflow-hidden"
            >
              <div className="container px-4 py-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button 
                        variant={isActive ? "secondary" : "ghost"} 
                        className={`w-full justify-start ${isActive ? 'font-medium' : 'text-muted-foreground'}`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-border/40 py-8 bg-card mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">CardSense AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Apriori Association Rule Mining. For educational purposes.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
