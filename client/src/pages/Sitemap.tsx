import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    // Fetch the sitemap XML content
    fetch('/api/sitemap')
      .then(response => {
        // If the response is successful, redirect to view the XML
        if (response.ok) {
          window.location.href = '/api/sitemap';
        }
      })
      .catch(error => {
        console.error('Error loading sitemap:', error);
      });
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Site Map</h1>
      <p>Loading sitemap... If it doesn't load automatically, <a href="/api/sitemap" className="text-teal-600 hover:underline">click here</a>.</p>
    </div>
  );
}