/**
 * Utility functions to generate structured data for SEO
 * This doesn't change website content, only adds machine-readable metadata
 */

interface StructuredDataProps {
  url: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Generate structured data for LocalBusiness schema
 */
export function generateLocalBusinessStructuredData({
  url,
  name = "Celia Dunsmore Counselling",
  description = "Accredited Mental Health Social Worker providing professional mental health counselling services with Medicare rebates available.",
  imageUrl,
}: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    description,
    url,
    telephone: "+61438593071", // Matches verified Google Business Profile
    email: "hello@celiadunsmorecounselling.com.au", // Public contact information
    address: {
      "@type": "PostalAddress",
      streetAddress: "503 Sydney Road",
      addressLocality: "Brunswick",
      addressRegion: "VIC",
      postalCode: "3056",
      addressCountry: "AU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -37.7698, // Brunswick, VIC coordinates
      longitude: 144.9631 // Brunswick, VIC coordinates
    },
    priceRange: "$$",
    image: imageUrl || "",
    sameAs: [
      "https://www.halaxy.com/profile/counsellor/ms-celia-dunsmore-counsellor/brunswick"
    ],
    openingHours: ["Mo 10:00-17:00", "Tu 10:00-17:00", "We 10:00-17:00", "Th 10:00-17:00", "Fr 10:00-17:00"], // Matches Google Business Profile hours
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -37.7698,
        longitude: 144.9631
      },
      geoRadius: "20000"
    }
  };

  return structuredData;
}

/**
 * Generate structured data for ProfessionalService schema
 */
export function generateProfessionalServiceStructuredData({
  url,
  name = "Celia Dunsmore Counselling",
  description = "Accredited Mental Health Social Worker providing professional mental health counselling services with Medicare rebates available.",
  imageUrl,
}: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": url,
    name,
    description,
    url,
    serviceType: "Mental Health Counselling",
    telephone: "+61438593071",
    email: "hello@celiadunsmorecounselling.com.au",
    address: {
      "@type": "PostalAddress",
      streetAddress: "503 Sydney Road",
      addressLocality: "Brunswick",
      addressRegion: "VIC",
      postalCode: "3056",
      addressCountry: "AU"
    },
    provider: {
      "@type": "Person",
      name: "Celia Dunsmore",
      jobTitle: "Accredited Mental Health Social Worker",
      telephone: "+61438593071",
      email: "hello@celiadunsmorecounselling.com.au",
      image: imageUrl || "",
      sameAs: [
        "https://www.halaxy.com/profile/counsellor/ms-celia-dunsmore-counsellor/brunswick"
      ]
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -37.7698,
        longitude: 144.9631
      },
      geoRadius: "20000"
    },
    openingHours: ["Mo 10:00-17:00", "Tu 10:00-17:00", "We 10:00-17:00", "Th 10:00-17:00", "Fr 10:00-17:00"],
    priceRange: "$$"
  };

  return structuredData;
}

/**
 * Add structured data to the page
 */
export function addStructuredData(data: any) {
  if (typeof window === "undefined") return;
  
  // Check if a JSON-LD script already exists
  let script = document.querySelector('script[type="application/ld+json"]');
  
  // If it exists, update it
  if (script) {
    script.textContent = JSON.stringify(data);
  } 
  // Otherwise, create a new script element
  else {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}