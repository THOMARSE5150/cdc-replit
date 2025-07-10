import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, lazy, Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Logo from "@/components/ui/Logo";
import { getPerformanceSettings } from "./lib/performance";
import LocationSectionSimple from "@/components/sections/LocationSectionSimple";
import LoadingScreen from "@/components/ui/LoadingScreen";
import StructuredData from "@/components/SEO/StructuredData";
import PreloadCriticalResources from "@/components/ui/PreloadCriticalResources";
import PerformanceOptimizer from "@/components/ui/PerformanceOptimizer";
import AIChatWidget from "@/components/ui/ai-chat-widget";
import SmoothScrollContainer from "@/components/ui/SmoothScrollContainer";
import BackToTop from "@/components/ui/BackToTop";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import { factoryAI } from "./lib/factory-ai-core";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

// Eagerly load the Home page for best initial load experience
import Home from "@/pages/Home";

// Lazy load all other pages to reduce initial bundle size
const NotFound = lazy(() => import("@/pages/not-found"));
const MeetCelia = lazy(() => import("@/pages/MeetCelia"));
const Services = lazy(() => import("@/pages/Services"));
const ClientDiversity = lazy(() => import("@/pages/ClientDiversity"));
const Fees = lazy(() => import("@/pages/Fees"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const BookingHelp = lazy(() => import("@/pages/BookingHelp"));
const Locations = lazy(() => import("@/pages/Locations"));
const Sitemap = lazy(() => import("@/pages/Sitemap"));

// Admin pages
const AdminCalendar = lazy(() => import("@/pages/admin/Calendar"));
const AdminContacts = lazy(() => import("@/pages/AdminContacts"));

// Regular layout with header for client-facing pages
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SmoothScrollContainer className="flex flex-col min-h-screen relative safe-top safe-bottom">
      <Header />
      <main id="main-content" className="flex-grow">{children}</main>
      <Footer />
      <AIChatWidget />
      <BackToTop />
      <PerformanceMonitor />
    </SmoothScrollContainer>
  );
};

// Admin layout with simplified header for admin pages
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <div className="bg-white border-b py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Logo className="transform scale-90" />
        </Link>
      </div>
      <Link href="/" className="text-sm text-gray-600 hover:text-primary">← Back to Website</Link>
    </div>
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* JSON-LD Structured Data for SEO - loads dynamically based on route */}
      <StructuredData path="/" />
      <StructuredData path="/meet-celia" />
      <StructuredData path="/services" />
      <StructuredData path="/client-diversity" />
      <StructuredData path="/fees" />
      <StructuredData path="/faq" />
      
      <Switch>
        {/* Admin routes */}
        <Route path="/admin/calendar">
          <AdminLayout>
            <AdminCalendar />
          </AdminLayout>
        </Route>
        
        <Route path="/admin/contacts">
          <AdminLayout>
            <AdminContacts />
          </AdminLayout>
        </Route>
        
        {/* Client-facing routes */}
        <Route path="/">
          <MainLayout>
            <Home />
          </MainLayout>
        </Route>
        <Route path="/meet-celia">
          <MainLayout>
            <MeetCelia />
          </MainLayout>
        </Route>
        <Route path="/services">
          <MainLayout>
            <Services />
          </MainLayout>
        </Route>
        <Route path="/client-diversity">
          <MainLayout>
            <ClientDiversity />
          </MainLayout>
        </Route>
        <Route path="/fees">
          <MainLayout>
            <Fees />
          </MainLayout>
        </Route>
        <Route path="/faq">
          <MainLayout>
            <FAQ />
          </MainLayout>
        </Route>
        <Route path="/contact">
          <MainLayout>
            <Contact />
          </MainLayout>
        </Route>
        
        <Route path="/locations">
          <MainLayout>
            <Locations />
          </MainLayout>
        </Route>
        
        <Route path="/booking-help">
          <MainLayout>
            <BookingHelp />
          </MainLayout>
        </Route>
        
        <Route path="/sitemap">
          <Sitemap />
        </Route>
        
        {/* 404 route */}
        <Route>
          <MainLayout>
            <NotFound />
          </MainLayout>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  // Get performance settings to optimize animations
  const performanceSettings = getPerformanceSettings();
  
  useEffect(() => {
    // Initialize Factory AI Enhanced System
    console.log('Factory AI: Initializing 2025 enhancement system...');
    
    // Set true viewport height for iOS devices
    const setViewportHeight = () => {
      // First, get the viewport height and multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set the height initially
    setViewportHeight();
    
    // Update height on window resize or orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Factory AI: Intelligent user profiling and optimization
    const initializeFactoryAI = async () => {
      try {
        // Detect user preferences and optimize accordingly
        const userProfile = {
          accessibilityNeeds: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          performancePreferences: navigator.connection?.effectiveType === '4g' ? 'enhanced' : 'minimal',
          deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        };
        
        // Apply Factory AI optimizations based on user profile
        factoryAI.optimizeForUser(userProfile);
        
        console.log('Factory AI: System initialized with user profile:', userProfile);
      } catch (error) {
        console.log('Factory AI: Initialization completed with basic configuration');
      }
    };

    initializeFactoryAI();
    
    // Initialize Google Analytics when app loads
    initGA();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      // Factory AI cleanup handled automatically
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PreloadCriticalResources />
        <PerformanceOptimizer />
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
