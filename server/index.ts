import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import staticRoutes from "./staticRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use static routes BEFORE any other middleware
app.use(staticRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add specific routes for favicons - MOVED EARLIER IN MIDDLEWARE CHAIN
app.get('/favicon.ico', (_req, res) => {
  console.log('Favicon.ico route hit!'); // Debug log
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  try {
    // Use the favicon.ico file directly (copied from favicon-32x32.png)
    const iconPath = path.join(__dirname, '../client/public/favicon.ico');
    const icon = fs.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error('Error serving favicon.ico:', error);
    // Fallback to PNG if ico file isn't found
    try {
      const pngPath = path.join(__dirname, '../client/public/favicon-32x32.png');
      const pngIcon = fs.readFileSync(pngPath);
      res.setHeader('Content-Type', 'image/png');
      res.send(pngIcon);
    } catch (fallbackError) {
      console.error('Error serving fallback favicon:', fallbackError);
      res.status(404).send('Not found');
    }
  }
});

app.get('/favicon-32x32.png', (_req, res) => {
  console.log('Favicon-32x32.png route hit!'); // Debug log
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  try {
    const iconPath = path.join(process.cwd(), 'client/public/favicon-32x32.png');
    const icon = fs.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error('Error serving favicon-32x32.png:', error);
    res.status(404).send('Not found');
  }
});

app.get('/apple-touch-icon.png', (_req, res) => {
  console.log('Apple-touch-icon.png route hit!'); // Debug log
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  try {
    const iconPath = path.join(__dirname, '../client/public/apple-touch-icon.png');
    const icon = fs.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error('Error serving apple-touch-icon.png:', error);
    res.status(404).send('Not found');
  }
});

// Skip www redirects in development mode
app.use((req, res, next) => {
  // Skip redirect logic for Replit development environment
  if (process.env.REPLIT_DOMAINS) {
    return next();
  }
  
  // Get the full host from headers (more reliable across proxies)
  const hostHeader = req.headers.host || '';
  const userAgent = req.headers['user-agent'] || '';
  
  // Check if the request is NOT coming from www subdomain
  // and is not localhost or an IP address
  if (!hostHeader.startsWith('www.') && 
      hostHeader.includes('.') && 
      !hostHeader.startsWith('localhost') &&
      !/^(\d{1,3}\.){3}\d{1,3}/.test(hostHeader)) {
    
    // Create the redirect URL with www prefix
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const newUrl = `${protocol}://www.${hostHeader}${req.originalUrl}`;
    
    // Add stronger no-cache headers especially for Chrome
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    // Add header to stop Chrome's bfcache behavior
    if (userAgent.includes('Chrome')) {
      res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
    }
    
    // Use a 307 temporary redirect for Chrome browsers to avoid caching issues
    // Use 301 permanent redirect for other browsers
    const statusCode = userAgent.includes('Chrome') ? 307 : 301;
    
    // Redirect with appropriate status code
    return res.redirect(statusCode, newUrl);
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Add a direct route for Google verification file
  app.get('/googlee964abc67dc1d83e.html', (_req, res) => {
    res.type('text/html');
    res.send('google-site-verification: googlee964abc67dc1d83e.html');
  });
  
  // Directly serve sitemap.xml with proper XML content type
  app.get('/sitemap.xml', (req, res) => {
    // Hardcoded XML sitemap content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>https://celiadunsmorecounselling.com.au/</loc>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>https://celiadunsmorecounselling.com.au/about</loc>
   </url>
   <url>
      <loc>https://celiadunsmorecounselling.com.au/services</loc>
   </url>
   <url>
      <loc>https://celiadunsmorecounselling.com.au/contact</loc>
   </url>
</urlset>`;
    
    // Set appropriate content type and cache control headers
    res.type('text/xml');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the XML content directly
    res.send(sitemapContent);
    console.log('Serving hardcoded sitemap.xml content');
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
