// Factory.ai Enhanced 2025 Integration System
export class FactoryAIEnhanced {
  private userProfile: UserProfile;
  private performanceMetrics: PerformanceMetrics;
  private adaptiveSettings: AdaptiveSettings;

  constructor() {
    this.userProfile = this.detectUserProfile();
    this.performanceMetrics = this.initPerformanceMetrics();
    this.adaptiveSettings = this.initAdaptiveSettings();
    this.initializeEnhancements();
  }

  private detectUserProfile(): UserProfile {
    const connection = (navigator as any).connection;
    const deviceMemory = (navigator as any).deviceMemory;
    
    return {
      accessibilityNeeds: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      performancePreferences: this.detectPerformanceLevel(),
      deviceType: this.detectDeviceType(),
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      connectionSpeed: connection?.effectiveType || 'unknown',
      deviceMemory: deviceMemory || 'unknown',
      preferredInteractionMethod: this.detectInteractionMethod(),
      culturalPreferences: this.detectCulturalPreferences()
    };
  }

  private detectPerformanceLevel(): 'high' | 'medium' | 'low' {
    const connection = (navigator as any).connection;
    const deviceMemory = (navigator as any).deviceMemory;
    
    // High performance indicators
    if (deviceMemory >= 8 && connection?.effectiveType === '4g') {
      return 'high';
    }
    
    // Low performance indicators
    if (deviceMemory <= 2 || connection?.effectiveType === '2g') {
      return 'low';
    }
    
    return 'medium';
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private detectInteractionMethod(): 'touch' | 'mouse' | 'hybrid' {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasMousePointer = window.matchMedia('(pointer: fine)').matches;
    
    if (isTouchDevice && hasMousePointer) return 'hybrid';
    if (isTouchDevice) return 'touch';
    return 'mouse';
  }

  private detectCulturalPreferences(): CulturalPreferences {
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return {
      language,
      timezone,
      numberFormat: new Intl.NumberFormat(language),
      dateFormat: new Intl.DateTimeFormat(language),
      writingDirection: this.getWritingDirection(language)
    };
  }

  private getWritingDirection(language: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.some(lang => language.startsWith(lang)) ? 'rtl' : 'ltr';
  }

  private initPerformanceMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      interactionDelay: 0,
      memoryUsage: 0,
      batteryLevel: 1,
      networkLatency: 0
    };
  }

  private initAdaptiveSettings(): AdaptiveSettings {
    return {
      animationDuration: this.userProfile.performancePreferences === 'low' ? 0 : 300,
      imageLazyLoading: this.userProfile.performancePreferences !== 'high',
      prefetchEnabled: this.userProfile.performancePreferences === 'high',
      hapticFeedback: this.userProfile.deviceType === 'mobile',
      voiceGuidance: this.userProfile.accessibilityNeeds,
      contrastMode: false
    };
  }

  private initializeEnhancements(): void {
    this.setupPerformanceOptimizations();
    this.setupAccessibilityEnhancements();
    this.setupAdaptiveInteractions();
    this.setupIntelligentPreloading();
    this.setupBehavioralAdaptation();
    
    console.log('Factory AI: Enhanced system initialized with user profile:', this.userProfile);
  }

  private setupPerformanceOptimizations(): void {
    // Adaptive animation system
    if (this.userProfile.performancePreferences === 'low') {
      document.documentElement.classList.add('low-performance-mode');
    }

    // Battery-aware optimizations
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2) {
          this.adaptiveSettings.animationDuration = 0;
          document.documentElement.classList.add('battery-saver-mode');
        }
      });
    }

    // Network-aware loading
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.adaptImageQuality(connection.effectiveType);
      });
    }
  }

  private setupAccessibilityEnhancements(): void {
    // Enhanced focus management
    this.setupFocusTrapping();
    this.setupScreenReaderOptimizations();
    this.setupKeyboardNavigation();
    
    // Color contrast adaptation
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast-mode');
    }

    // Motion preference handling
    if (this.userProfile.accessibilityNeeds) {
      document.documentElement.classList.add('cognitive-friendly');
    }
  }

  private setupAdaptiveInteractions(): void {
    // Touch-optimized interactions for mobile
    if (this.userProfile.deviceType === 'mobile') {
      this.setupTouchOptimizations();
      this.setupHapticFeedback();
    }

    // Mouse-optimized interactions for desktop
    if (this.userProfile.preferredInteractionMethod === 'mouse') {
      this.setupMouseOptimizations();
    }

    // Gesture recognition for tablets
    if (this.userProfile.deviceType === 'tablet') {
      this.setupGestureRecognition();
    }
  }

  private setupIntelligentPreloading(): void {
    if (!this.adaptiveSettings.prefetchEnabled) return;

    // Preload critical resources based on user behavior
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.preloadSectionResources(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    // Observe key sections for preloading
    document.querySelectorAll('section[data-preload]').forEach(section => {
      observer.observe(section);
    });
  }

  private setupBehavioralAdaptation(): void {
    // Track user interaction patterns
    let interactionCount = 0;
    let lastInteractionTime = Date.now();

    document.addEventListener('click', () => {
      interactionCount++;
      const currentTime = Date.now();
      const timeSinceLastInteraction = currentTime - lastInteractionTime;
      
      // Adapt interface based on interaction speed
      if (timeSinceLastInteraction < 500 && interactionCount > 3) {
        // User is interacting quickly - reduce animations
        this.adaptiveSettings.animationDuration = Math.max(0, this.adaptiveSettings.animationDuration - 50);
      }
      
      lastInteractionTime = currentTime;
    });
  }

  // Public methods for component integration
  public optimizeForUser(userOverrides?: Partial<UserProfile>): void {
    if (userOverrides) {
      this.userProfile = { ...this.userProfile, ...userOverrides };
    }
    this.applyOptimizations();
  }

  public getAdaptiveSettings(): AdaptiveSettings {
    return { ...this.adaptiveSettings };
  }

  public addHapticFeedback(element: HTMLElement): void {
    if (!this.adaptiveSettings.hapticFeedback) return;

    element.addEventListener('click', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });
  }

  public enhanceLocationCard(element: HTMLElement): void {
    // Add Factory.ai enhancements to location cards
    this.addSmoothAnimations(element);
    this.addIntelligentHover(element);
    this.addAdaptiveInteractions(element);
    this.addAccessibilityEnhancements(element);
  }

  private addSmoothAnimations(element: HTMLElement): void {
    element.style.transition = `all ${this.adaptiveSettings.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add('animate-in');
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(element);
  }

  private addIntelligentHover(element: HTMLElement): void {
    if (this.userProfile.preferredInteractionMethod === 'touch') return;

    let hoverTimeout: NodeJS.Timeout;
    
    element.addEventListener('mouseenter', () => {
      hoverTimeout = setTimeout(() => {
        element.classList.add('hover-active');
        this.preloadAssociatedContent(element);
      }, 200); // Delay to avoid accidental triggers
    });

    element.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      element.classList.remove('hover-active');
    });
  }

  private addAdaptiveInteractions(element: HTMLElement): void {
    // Add appropriate interaction feedback based on device type
    if (this.userProfile.deviceType === 'mobile') {
      this.addHapticFeedback(element);
      element.classList.add('touch-optimized');
    }

    // Add visual feedback for all interactions
    element.addEventListener('click', () => {
      element.classList.add('clicked');
      setTimeout(() => element.classList.remove('clicked'), 150);
    });
  }

  private addAccessibilityEnhancements(element: HTMLElement): void {
    // Ensure proper ARIA labels
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        element.setAttribute('aria-labelledby', heading.id || this.generateId('heading'));
      }
    }

    // Add keyboard navigation support
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    // Add focus indicators
    element.addEventListener('focus', () => {
      element.classList.add('factory-ai-focused');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('factory-ai-focused');
    });
  }

  // Private helper methods
  private setupFocusTrapping(): void {
    // Implementation for focus trapping in modals/dialogs
  }

  private setupScreenReaderOptimizations(): void {
    // Implementation for screen reader optimizations
  }

  private setupKeyboardNavigation(): void {
    // Implementation for enhanced keyboard navigation
  }

  private setupTouchOptimizations(): void {
    // Implementation for touch-specific optimizations
  }

  private setupHapticFeedback(): void {
    // Implementation for haptic feedback
  }

  private setupMouseOptimizations(): void {
    // Implementation for mouse-specific optimizations
  }

  private setupGestureRecognition(): void {
    // Implementation for gesture recognition on tablets
  }

  private adaptImageQuality(connectionType: string): void {
    // Implementation for adaptive image quality
  }

  private preloadSectionResources(element: Element): void {
    // Implementation for intelligent resource preloading
  }

  private preloadAssociatedContent(element: HTMLElement): void {
    // Implementation for content preloading on hover
  }

  private applyOptimizations(): void {
    // Implementation for applying user-specific optimizations
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Type definitions
interface UserProfile {
  accessibilityNeeds: boolean;
  performancePreferences: 'high' | 'medium' | 'low';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  colorScheme: 'light' | 'dark';
  connectionSpeed: string;
  deviceMemory: number | string;
  preferredInteractionMethod: 'touch' | 'mouse' | 'hybrid';
  culturalPreferences: CulturalPreferences;
}

interface CulturalPreferences {
  language: string;
  timezone: string;
  numberFormat: Intl.NumberFormat;
  dateFormat: Intl.DateTimeFormat;
  writingDirection: 'ltr' | 'rtl';
}

interface PerformanceMetrics {
  loadTime: number;
  interactionDelay: number;
  memoryUsage: number;
  batteryLevel: number;
  networkLatency: number;
}

interface AdaptiveSettings {
  animationDuration: number;
  imageLazyLoading: boolean;
  prefetchEnabled: boolean;
  hapticFeedback: boolean;
  voiceGuidance: boolean;
  contrastMode: boolean;
}

// Export singleton instance
export const factoryAIEnhanced = new FactoryAIEnhanced();