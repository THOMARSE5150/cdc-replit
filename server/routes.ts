import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, insertBookingSchema, insertContactSchema, type Contact, type PracticeLocation } from "./storage.js";
import { z } from "zod";
import { sendBookingConfirmation, sendContactConfirmation } from "./email.js";
import { createMentalHealthAI } from "./mentalHealthAI.js";
import path from "path";
import fs from "fs";
// Import both real and mock Google Calendar implementations
import * as realGoogleCalendar from "./googleCalendar.js";
import * as mockGoogleCalendar from "./mockGoogleCalendar.js";

// By default, use the real implementation
const googleCalendar = realGoogleCalendar;

// Export both implementations for use in specific routes
export const googleCalendarImplementations = {
  real: realGoogleCalendar,
  mock: mockGoogleCalendar
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  app.get("/favicon.ico", (req, res) => {
    console.log('Redirecting from favicon.ico to favicon-32x32.png');
    res.redirect("/favicon-32x32.png");
  });

  app.get("/sitemap.xml", (req, res) => {
    try {
      const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
      if (fs.existsSync(sitemapPath)) {
        const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        res.header('Content-Type', 'text/xml');
        console.log('Serving sitemap.xml directly from file');
        return res.send(sitemapContent);
      } else {
        res.status(404).send("Sitemap not found");
      }
    } catch (error) {
      console.error("Error serving sitemap:", error);
      res.status(500).send("Error serving sitemap");
    }
  });
  
  app.get("/api/sitemap", (req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      res.setHeader('Content-Type', 'text/xml');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).send(sitemapContent);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });
  
  app.get("/api/download-backup", (req, res) => {
    const backupPath = path.join(process.cwd(), "backups", "website-backup-20250501140412.zip");
    if (fs.existsSync(backupPath)) {
      res.download(backupPath);
    } else {
      res.status(404).send("Backup file not found");
    }
  });
  
  app.get("/api/download-cdc20", (req, res) => {
    const cdc20Path = path.join(process.cwd(), "CDC20.zip");
    if (fs.existsSync(cdc20Path)) {
      res.download(cdc20Path, "CDC20.zip");
    } else {
      res.status(404).send("CDC20 backup file not found");
    }
  });

  app.get("/website-enhancement-summary", (req, res) => {
    const summaryHTML = `<!DOCTYPE html>...`; // The long HTML string from your original file
    res.setHeader('Content-Type', 'text/html');
    res.send(summaryHTML);
  });

  app.get("/api/download-summary", (req, res) => {
    const summaryHTML = `<!DOCTYPE html>...`; // The long HTML string from your original file
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Website-Enhancement-Summary-Celia-Dunsmore.html"');
    res.send(summaryHTML);
  });

  app.post("/api/admin/availability", async (req, res) => {
    try {
      const { date, slots } = req.body;
      const result = await storage.upsertAvailability(date, slots);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  app.get("/api/admin/availability/dates", async (req, res) => {
    try {
      const { year, month } = req.query;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;
      const availability = await storage.getAvailabilityRange(startDate, endDate);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve availability" });
    }
  });

  app.get("/api/admin/availability", async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates required" });
      }
      const availability = await storage.getAvailabilityRange(start as string, end as string);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve availability" });
    }
  });

  app.get("/api/test-json", (req, res) => {
    res.json({ success: true, message: "This is a test JSON response" });
  });

  app.get("/api/config/maps", (req, res) => {
    let apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Google Maps API key not configured" });
    if (apiKey.includes('=')) apiKey = apiKey.split('=')[1].trim();
    res.json({ apiKey });
  });

  app.get("/api/auth/google", (req, res) => {
    try {
      const authUrl = googleCalendar.getAuthUrl();
      if (req.query.manual === 'true') {
        return res.json({ authUrl: authUrl });
      }
      res.redirect(authUrl);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate auth URL' });
    }
  });

  app.post("/api/google/manual-auth", async (req, res) => {
    try {
      let { code, useMock } = req.body;
      if (useMock || code === 'mock-auth-code') {
        const tokens = await googleCalendarImplementations.mock.exchangeCodeForTokens('mock-auth-code');
        return res.status(200).json({ success: true });
      }
      if (!code || typeof code !== 'string') return res.status(400).json({ error: 'No authorization code provided' });
      if (code.includes('&')) code = code.split('&')[0];
      const tokens = await googleCalendar.exchangeCodeForTokens(code);
      return res.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/google/oauth/callback", async (req, res) => {
    try {
      if (req.query.error) return res.redirect(`/admin/calendar?error=${encodeURIComponent(req.query.error as string)}`);
      const { code } = req.query;
      if (!code || typeof code !== 'string') throw new Error('No code provided');
      await googleCalendar.exchangeCodeForTokens(code);
      res.redirect('/admin/calendar?success=true');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.redirect(`/admin/calendar?error=${encodeURIComponent(errorMessage)}`);
    }
  });

  app.get("/api/google/calendars", async (req, res) => {
    try {
      const tokens = await storage.getGoogleTokens();
      const isMockAuth = tokens && tokens.accessToken === 'mock-access-token';
      if (isMockAuth) {
        const mockCalendars = await googleCalendarImplementations.mock.listCalendars();
        return res.json(mockCalendars);
      }
      const calendars = await googleCalendar.listCalendars();
      if (!calendars) return res.status(401).json({ message: "Not authenticated with Google Calendar" });
      res.json(calendars);
    } catch (error) {
      res.status(500).json({ message: "Failed to list calendars" });
    }
  });

  app.get("/api/google/status", async (req, res) => {
    try {
      const isConnected = await googleCalendar.hasValidCredentials();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ connected: false, error: "Failed to check Google connection status" });
    }
  });

  app.post("/api/google/sync", async (req, res) => {
    try {
      const { calendarId, startDate, endDate } = req.body;
      if (!calendarId || !startDate || !endDate) return res.status(400).json({ message: "Missing required parameters" });
      const syncResult = await googleCalendar.syncCalendarAvailability(calendarId, new Date(startDate), new Date(endDate));
      res.json({ success: syncResult });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync with Google Calendar" });
    }
  });

  app.post("/api/google/disconnect", async (req, res) => {
    try {
      const result = await googleCalendar.disconnectGoogleCalendar();
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect from Google Calendar" });
    }
  });

  app.delete("/api/admin/availability/:date", async (req, res) => {
    try {
      await storage.deleteAvailability(req.params.date);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete availability" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      await sendBookingConfirmation(booking);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      else res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve booking" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const ai = createMentalHealthAI();
      const response = await ai.processClientInquiry(message, context);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "For assistance, please contact Celia directly at (03) 9041 5031", urgencyLevel: 5, shouldEscalate: true });
    }
  });

  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getActivePracticeLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.post("/api/locations/recommend", async (req, res) => {
    try {
      const { clientLocation, transportPreference, accessibilityNeeds, urgencyLevel } = req.body;
      const ai = createMentalHealthAI();
      const recommendation = await ai.analyzeLocationMatch({ clientLocation, transportPreference, accessibilityNeeds, urgencyLevel });
      res.json({ recommendedLocation: recommendation.bestMatch, reasoning: recommendation.reasoning, alternativeOptions: recommendation.alternatives, personalizedMessage: recommendation.message });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate location recommendation" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const ai = createMentalHealthAI();
      const aiAnalysis = await ai.processClientInquiry(contactData.message, { name: `${contactData.firstName} ${contactData.lastName}`, email: contactData.email, inquiryType: contactData.enquiryType, preferredLocation: contactData.preferredLocation });
      const locationRecommendation = await ai.recommendOptimalLocation({ message: contactData.message, preferredLocation: contactData.preferredLocation, urgencyLevel: aiAnalysis.urgencyLevel });
      const contact = await storage.createContact(contactData);
      await sendContactConfirmation(contactData.firstName, contactData.lastName, contactData.email, contactData.message);
      res.status(201).json({ message: "Message sent successfully", id: contact.id, aiInsights: { urgencyLevel: aiAnalysis.urgencyLevel, shouldEscalate: aiAnalysis.shouldEscalate, suggestedActions: aiAnalysis.suggestedActions, recommendedLocation: locationRecommendation.locationId, locationReasoning: locationRecommendation.reasoning } });
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      else res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const adminToken = req.headers.authorization?.split(' ')[1];
      const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'celia-admin-token';
      if (adminToken !== ADMIN_TOKEN) return res.status(401).json({ message: "Unauthorized" });
      const contacts = await storage.getAllContacts();
      contacts.sort((a: Contact, b: Contact) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}