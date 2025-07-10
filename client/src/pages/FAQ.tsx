import { motion } from "framer-motion";
import { useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { faqItems } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import { SEO } from "@/components/ui/SEO";
import { addStructuredData, generateProfessionalServiceStructuredData } from "@/lib/structuredData";

export default function FAQ() {
  useEffect(() => {
    const url = window.location.href;
    const structuredData = generateProfessionalServiceStructuredData({ 
      url,
      name: "Counselling FAQ",
      description: "Frequently asked questions about counselling services, fees, session information, and what to expect."
    });
    addStructuredData(structuredData);

    // Add FAQ structured data for Google featured snippets
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    script.id = 'faq-schema';
    
    const existingScript = document.getElementById('faq-schema');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(faqSchema);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById('faq-schema');
      if (script) script.remove();
    };
  }, []);

  return (
    <>
      <SEO
        title="Counselling FAQ | Accredited Mental Health Social Worker Melbourne"
        description="Find answers to frequently asked questions about counselling services, fees, and what to expect from sessions with Celia Dunsmore, Accredited Mental Health Social Worker in Melbourne's inner north."
        canonicalPath="/faq"
      />
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about counselling and my services"
      />
      
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center p-6 bg-secondary-light rounded-lg">
            <h3 className="text-xl font-medium text-text-primary mb-4">Have another question?</h3>
            <p className="text-text-secondary mb-6">
              If you couldn't find the answer you're looking for, please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <a className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md transition-colors inline-block">
                  Contact Me
                </a>
              </Link>
              <Link href="/booking">
                <a className="border border-primary text-primary hover:bg-primary-light hover:text-white px-6 py-2 rounded-md transition-colors inline-block">
                  Book an Appointment
                </a>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
