import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesPreview from "@/components/sections/ServicesPreview";
import LocationsPreview from "@/components/sections/LocationsPreview";
import ClientDiversitySection from "@/components/sections/ClientDiversitySection";
import FeesSection from "@/components/sections/FeesSection";
import HalaxyIntegration from "@/components/sections/HalaxyIntegration";
import { SEO } from "@/components/ui/SEO";
import { addStructuredData, generateLocalBusinessStructuredData } from "@/lib/structuredData";

export default function Home() {
  useEffect(() => {
    // Add structured data for the homepage - LocalBusiness
    const url = window.location.href;
    const structuredData = generateLocalBusinessStructuredData({ url });
    addStructuredData(structuredData);
  }, []);

  return (
    <>
      <SEO
        title="Melbourne Counselling | Accredited Mental Health Social Worker | Celia Dunsmore Counselling"
        description="Professional counselling services by Celia Dunsmore, Accredited Mental Health Social Worker in Melbourne's inner north, providing support for anxiety, depression and trauma."
        canonicalPath="/"
      />
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <LocationsPreview />
      <ClientDiversitySection />
      <FeesSection />
      <HalaxyIntegration />
    </>
  );
}
