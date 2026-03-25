import { useEffect } from 'react';

export default function SEO({ 
  title = "ExportAgent - #1 AI Export Platform | Automate Global Trade",
  description = "The leading AI-powered platform for exporters. Automate invoices, generate export documents, find HS codes, and connect with global buyers. Save 90% of documentation time.",
  keywords = "export platform, ai export assistant, export documentation, hs code finder, export invoice generator, international trade, export automation, b2b marketplace, shipping documents",
  ogImage = "https://export-agent-invoice-rspats2739.replit.app/og-image.jpg",
  canonical = "https://export-agent-invoice-rspats2739.replit.app"
}) {
  useEffect(() => {
    document.title = title;
    
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', canonical, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');
    
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonical);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonical);
      document.head.appendChild(linkCanonical);
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ExportAgent",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "127"
      },
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": "EXPORTAGENT LTD",
        "url": canonical,
        "logo": {
          "@type": "ImageObject",
          "url": `${canonical}/logo.png`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-20-1234-5678",
          "contactType": "Customer Service",
          "email": "hello@exportagent.com"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB",
          "addressLocality": "London"
        }
      }
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(structuredData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }
  }, [title, description, keywords, ogImage, canonical]);

  return null;
}
