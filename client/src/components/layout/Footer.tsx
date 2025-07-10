import { Link, useLocation } from "wouter";
import Logo from "@/components/ui/Logo";
import { MailIcon, PhoneIcon, MapPinIcon, Calendar, Heart, ArrowRight, ExternalLink, Phone, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useMicroInteractions, getMicroInteractionClasses, getMicroInteractionProps } from "@/hooks/useMicroInteractions";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices for optimized rendering
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get current location to check if we're on admin or booking pages
  const [location] = useLocation();
  const isBookingPage = location.includes('/booking');
  const isAdminPage = location.includes('/admin');
  
  // Mobile footer - comprehensive content in mobile-optimized layout
  if (isMobile) {
    // Don't show footer on booking page or admin pages
    if (isBookingPage || isAdminPage) {
      return null;
    }
    
    return (
      <footer className="text-text-primary bg-gradient-to-b from-background to-primary/5 pt-8 pb-4 safe-bottom">
        {/* Mobile CTA Section */}
        <div className="container mx-auto px-4 mb-6">
          <div className="glass-effect rounded-xl p-4 text-center">
            <h3 className="text-lg font-bold mb-1 text-text-primary">Ready to start your healing journey?</h3>
            <p className="text-text-secondary text-xs mb-4">Take the first step toward positive change today.</p>
            
            <div className="flex gap-2">
              <Link 
                href="/contact"
                className="touch-target flex-1 flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-medium text-xs shadow-colored-md shadow-primary/60 active:scale-[0.98] transition-all duration-200"
              >
                <Heart className="h-3 w-3 mr-1.5" />
                <span>Contact Me</span>
              </Link>
              
              <a 
                href="tel:+61438593071" 
                className="touch-target flex-1 flex items-center justify-center glass-effect border-transparent text-primary py-3 rounded-lg font-medium text-xs shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <Phone className="h-3 w-3 mr-1.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Main Footer Content - Collapsed Design */}
        <div className="container mx-auto px-4">
          {/* Essential Info Only */}
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              <a href="mailto:hello@celiadunsmorecounselling.com.au" className="touch-target flex items-center gap-3 glass-effect text-primary py-2.5 px-3 rounded-lg text-xs">
                <MailIcon className="h-4 w-4 text-primary flex-shrink-0" />
                <span>hello@celiadunsmorecounselling.com.au</span>
              </a>
              <a href="tel:+61438593071" className="touch-target flex items-center gap-3 glass-effect text-primary py-2.5 px-3 rounded-lg text-xs">
                <PhoneIcon className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+61 438 593 071</span>
              </a>
            </div>
          </div>

          {/* Locations - Compact */}
          <div className="mb-4">
            <h4 className="text-xs font-bold mb-2 text-primary">Locations</h4>
            <div className="space-y-2">
              <div className="glass-effect p-2.5 rounded-lg text-xs">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-primary font-medium">Online Sessions</span>
                </div>
              </div>
              
              <div className="glass-effect p-2.5 rounded-lg text-xs">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-primary font-medium">Brunswick:</span>
                    <span className="text-text-secondary ml-1">503 Sydney Road</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-2.5 rounded-lg text-xs">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-primary font-medium">Coburg:</span>
                    <span className="text-text-secondary ml-1">81B Bell Street & 259 Sydney Road</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright - Compact */}
          <div className="text-center pt-3 border-t border-white/10">
            <div className="mb-2">
              <Logo variant="circular" className="mx-auto mb-1" />
              <p className="text-xs text-text-secondary">
                © {currentYear} Celia Dunsmore Counselling
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  // Desktop footer with modern 2025 design trends
  return (
    <footer className={`text-text-primary ${isAdminPage ? 'pt-12' : 'pt-24'} pb-12 safe-bottom bg-gradient-to-b from-background via-background to-primary/5`}>
      {/* CTA Section - Floating card with glass effect - Hidden on admin pages */}
      {!isAdminPage && (
        <div className="container mx-auto px-6 lg:px-8 relative z-10 -mt-16 mb-20">
          <div className="glass-effect rounded-3xl p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-text-primary">Ready to start your healing journey?</h3>
              <p className="text-text-secondary md:text-lg">Take the first step toward positive change today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link 
                href="/contact" 
                className="group relative overflow-hidden bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-colored-md shadow-primary/30 hover:shadow-colored-lg hover:shadow-primary/40 whitespace-nowrap flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Contact Me</span>
                <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a 
                href="tel:+61438593071" 
                className="flex items-center justify-center glass-effect border-transparent hover:border-primary/20 text-primary hover:text-primary-dark px-8 py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                <span>Call Me Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16">
          {/* Left side: Logo, tagline and membership */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <Logo variant="circular" className="mb-6" />
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Creating positive change through compassionate counselling and mental health support.
              </p>
              
              {/* Membership badge with modern 2025 styling */}
              <div className="inline-flex items-center glass-effect p-4 rounded-xl shadow-md border-transparent">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 backdrop-blur-sm">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Member of</p>
                  <p className="text-base font-medium text-text-primary">Australian Association of Social Workers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Contact section */}
          <div className="flex flex-col justify-center">
            <h4 className="text-2xl font-bold mb-8 text-primary">Contact</h4>
            <div className="space-y-6">
              <a href="mailto:hello@celiadunsmorecounselling.com.au" className="group flex items-center gap-4 glass-effect text-primary py-4 px-6 rounded-xl border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <MailIcon className="h-6 w-6" />
                </span>
                <span className="text-lg font-medium">Email Me</span>
                <ArrowUpRight className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
              
              <a href="tel:+61438593071" className="group flex items-center gap-4 glass-effect text-primary py-4 px-6 rounded-xl border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <PhoneIcon className="h-6 w-6" />
                </span>
                <span className="text-lg font-medium">Call +61 438 593 071</span>
                <ArrowUpRight className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer bottom: Copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/30">
          <div className="text-text-secondary/70 text-xs order-2 md:order-1 mt-6 md:mt-0">
            &copy; {currentYear} Celia Dunsmore Counselling. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 order-1 md:order-2">
            <Link href="/privacy-policy" className="group text-text-secondary hover:text-primary text-xs transition-colors relative">
              <span>Privacy Policy</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full opacity-70"></span>
            </Link>
            <Link href="/terms" className="group text-text-secondary hover:text-primary text-xs transition-colors relative">
              <span>Terms of Service</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full opacity-70"></span>
            </Link>
            <div className="flex gap-3">
              <Link 
                href="/admin/calendar" 
                className="glass-effect border-transparent text-text-secondary hover:text-primary transition-colors hover:shadow-sm px-3 py-1.5 rounded-full group" 
                title="Admin Calendar Management"
              >
                <div className="flex items-center text-xs">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  <span className="group-hover:underline">Calendar</span>
                </div>
              </Link>
              <Link 
                href="/admin/contacts" 
                className="glass-effect border-transparent text-text-secondary hover:text-primary transition-colors hover:shadow-sm px-3 py-1.5 rounded-full group" 
                title="Contact Form Submissions"
              >
                <div className="flex items-center text-xs">
                  <MailIcon className="h-3 w-3 mr-1.5" />
                  <span className="group-hover:underline">Contacts</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}