import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XIcon, ChevronRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useMicroInteractions, getMicroInteractionClasses, getMicroInteractionProps } from "@/hooks/useMicroInteractions";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [connectButtonState, connectButtonHandlers] = useMicroInteractions({ enableHaptics: true });
  const [mobileMenuState, mobileMenuHandlers] = useMicroInteractions({ enableHaptics: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Meet Celia", href: "/meet-celia" },
    { name: "Services", href: "/services" },
    { name: "Locations", href: "/locations" },
    { name: "Client Diversity", href: "/client-diversity" },
    { name: "Fees", href: "/fees" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isNavItemActive = (href: string): boolean => {
    return location === href;
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass-effect py-3" 
          : "bg-transparent py-6"
      }`}
    >
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
        <div className="flex justify-between items-center min-h-[90px] w-full">
          <Link href="/" className="group flex items-center transition-all duration-300 relative flex-shrink-0 mr-4 lg:mr-8">
            <div className="absolute -inset-3 rounded-xl bg-white/0 group-hover:bg-white/50 group-hover:backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10"></div>
            <Logo />
          </Link>

          {/* Desktop Navigation - Enhanced Accessibility */}
          <nav className="hidden lg:flex items-center flex-1 justify-center min-w-0 mx-2 xl:mx-4" role="navigation" aria-label="Main navigation">
            <div className="flex gap-1 xl:gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm overflow-hidden">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`relative flex items-center transition-all px-2 xl:px-3 py-2.5 rounded-full text-xs xl:text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap ${
                    isNavItemActive(item.href) 
                      ? "text-white bg-primary shadow-[0_2px_10px_rgba(0,0,0,0.1)]" 
                      : "text-text-secondary hover:text-primary hover:bg-white/80"
                  }`}
                  aria-current={isNavItemActive(item.href) ? "page" : undefined}
                >
                  <div className="relative z-10">
                    {item.name}
                  </div>
                  {isNavItemActive(item.href) && (
                    <motion.div 
                      layoutId="navIndicator"
                      className="absolute inset-0 rounded-full bg-primary -z-0"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden lg:block flex-shrink-0 ml-2 xl:ml-4">
            <Link 
              href="/contact"
              className={getMicroInteractionClasses(
                connectButtonState,
                "group overflow-hidden relative bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-3 xl:px-4 py-2.5 xl:py-3 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 flex items-center font-medium micro-button micro-lift micro-glow micro-ripple",
                {
                  hover: "micro-scale",
                  active: "micro-click"
                }
              )}
              {...getMicroInteractionProps(connectButtonHandlers)}
            >
              <span className="relative z-10 text-xs xl:text-sm">Connect With Me</span>
              <ChevronRight className="relative z-10 ml-1 xl:ml-2 h-3 xl:h-4 w-3 xl:w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button - Enhanced Accessibility */}
          <button
            className={getMicroInteractionClasses(
              mobileMenuState,
              "lg:hidden touch-target relative overflow-hidden bg-white/80 backdrop-blur-sm text-primary p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0 micro-button micro-lift micro-ripple",
              {
                hover: "micro-scale",
                active: "micro-click"
              }
            )}
            onMouseEnter={mobileMenuHandlers.onHover}
            onMouseLeave={mobileMenuHandlers.onLeave}
            onMouseDown={mobileMenuHandlers.onActive}
            onMouseUp={mobileMenuHandlers.onInactive}
            onClick={(e) => {
              setMobileMenuOpen(true);
              mobileMenuHandlers.onRipple(e);
            }}
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="mobile-navigation"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - 2025 Redesign */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/80 z-50 md:hidden safe-top safe-bottom"
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="container mx-auto px-4 py-6 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center">
                  <Logo />
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-primary bg-white p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  aria-label="Close menu"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <motion.nav 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col space-y-3 mt-10 flex-grow justify-center"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                  >
                    <Link 
                      href={item.href}
                      className={`touch-target flex items-center py-4 px-5 rounded-xl transition-all relative overflow-hidden touch-manipulation min-h-[56px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-98 ${
                        isNavItemActive(item.href) 
                          ? "text-white bg-primary shadow-md shadow-primary/25" 
                          : "text-text-primary bg-white/60 hover:bg-white hover:shadow-sm"
                      }`}
                      aria-current={isNavItemActive(item.href) ? "page" : undefined}
                    >
                      <div className="relative z-10 flex items-center w-full">
                        {isNavItemActive(item.href) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white mr-2"
                          />
                        )}
                        <span className="text-lg font-medium">{item.name}</span>
                        <ChevronRight className="ml-auto h-5 w-5 opacity-60" />
                      </div>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + navItems.length * 0.05, duration: 0.4 }}
                  className="pt-4 mt-auto"
                >
                  <Link
                    href="/contact"
                    className="touch-target bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-4 rounded-xl transition-all duration-300 text-center flex items-center justify-center shadow-lg shadow-primary/15 active:scale-98 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  >
                    <span className="text-lg font-medium">Connect With Me</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}