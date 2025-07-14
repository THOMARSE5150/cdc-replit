var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  bookings;
  contacts;
  practiceLocations;
  bookingId;
  contactId;
  locationId;
  availabilityId;
  availability;
  googleTokensData;
  constructor() {
    this.bookings = /* @__PURE__ */ new Map();
    this.contacts = /* @__PURE__ */ new Map();
    this.practiceLocations = /* @__PURE__ */ new Map();
    this.bookingId = 1;
    this.contactId = 1;
    this.locationId = 1;
    this.availabilityId = 1;
    this.availability = /* @__PURE__ */ new Map();
    this.googleTokensData = null;
    this.initializeDefaultLocations();
  }
  initializeDefaultLocations() {
    const defaultLocations = [
      {
        locationId: "brunswick",
        name: "Brunswick",
        displayName: "Brunswick Primary Location",
        address: "503 Sydney Road, Brunswick VIC",
        description: "Primary location with excellent public transport access",
        isPrimary: true,
        isActive: true,
        coordinates: { lat: -37.7749, lng: 144.9631 },
        features: ["Ground floor access", "Tram stop directly outside", "Street parking available"],
        hours: {
          "Monday": "9:00 AM - 5:00 PM",
          "Tuesday": "9:00 AM - 5:00 PM",
          "Wednesday": "9:00 AM - 5:00 PM",
          "Thursday": "9:00 AM - 5:00 PM",
          "Friday": "9:00 AM - 5:00 PM"
        },
        parking: "Street parking available on Sydney Road",
        transport: ["Tram 19", "Bus 506"],
        phone: "(03) 9041 5031",
        email: null,
        contactPersonName: null,
        specialNotes: null,
        accessibilityFeatures: ["Ground floor access", "Wide doorways"],
        availableServices: ["Individual counselling", "Telehealth"],
        sortOrder: 1
      },
      {
        locationId: "coburg-bell",
        name: "Coburg Bell Street",
        displayName: "Coburg - Bell Street Location",
        address: "81B Bell Street, Coburg VIC 3058",
        description: "New location with on-site parking available",
        isPrimary: false,
        isActive: true,
        coordinates: { lat: -37.7559, lng: 144.9647 },
        features: ["On-site parking", "8 minute walk from Coburg Station", "Weekend availability"],
        hours: {
          "Monday": "9:00 AM - 5:00 PM",
          "Tuesday": "9:00 AM - 5:00 PM",
          "Wednesday": "9:00 AM - 5:00 PM",
          "Thursday": "9:00 AM - 5:00 PM",
          "Friday": "9:00 AM - 5:00 PM",
          "Saturday": "9:00 AM - 1:00 PM"
        },
        parking: "Free on-site parking available",
        transport: ["Train to Coburg Station", "Bus 508"],
        phone: "(03) 9041 5031",
        email: null,
        contactPersonName: null,
        specialNotes: null,
        accessibilityFeatures: ["Ground level parking", "Accessible entrance"],
        availableServices: ["Individual counselling", "Weekend appointments"],
        sortOrder: 2
      },
      {
        locationId: "coburg-solana",
        name: "Coburg Solana Psychology",
        displayName: "Coburg - Solana Psychology",
        address: "FL 1, 420 Sydney Road, Coburg VIC 3058",
        description: "Convenient location",
        isPrimary: false,
        isActive: true,
        coordinates: { lat: -37.7423, lng: 144.9631 },
        features: ["First floor with lift access", "Near Coburg Station", "Professional psychology centre"],
        hours: {
          "Monday": "9:00 AM - 5:00 PM",
          "Tuesday": "9:00 AM - 5:00 PM",
          "Wednesday": "9:00 AM - 5:00 PM",
          "Thursday": "9:00 AM - 5:00 PM",
          "Friday": "9:00 AM - 5:00 PM"
        },
        parking: "Limited street parking available",
        transport: ["Train to Coburg Station", "Tram 19"],
        phone: "(03) 9041 5031",
        email: null,
        contactPersonName: null,
        specialNotes: null,
        accessibilityFeatures: ["Lift access", "Professional centre"],
        availableServices: ["Individual counselling", "Specialist referrals"],
        sortOrder: 3
      }
    ];
    defaultLocations.forEach((locationData) => {
      const id = this.locationId++;
      const now = /* @__PURE__ */ new Date();
      const location = {
        id,
        ...locationData,
        createdAt: now,
        updatedAt: now
      };
      this.practiceLocations.set(id, location);
    });
  }
  // Booking methods
  async getAllBookings() {
    return Array.from(this.bookings.values());
  }
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async createBooking(insertBooking) {
    const id = this.bookingId++;
    const createdAt = /* @__PURE__ */ new Date();
    const booking = {
      ...insertBooking,
      id,
      createdAt,
      status: "confirmed"
    };
    this.bookings.set(id, booking);
    return booking;
  }
  // Contact methods
  async createContact(insertContact) {
    const id = this.contactId++;
    const createdAt = /* @__PURE__ */ new Date();
    const contact = {
      id,
      firstName: insertContact.firstName,
      lastName: insertContact.lastName,
      email: insertContact.email,
      phone: insertContact.phone,
      enquiryType: insertContact.enquiryType,
      preferredLocation: insertContact.preferredLocation || null,
      message: insertContact.message,
      urgencyLevel: insertContact.urgencyLevel || 1,
      privacyConsent: insertContact.privacyConsent || false,
      createdAt
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getAllContacts() {
    return Array.from(this.contacts.values());
  }
  async getContact(id) {
    return this.contacts.get(id);
  }
  // Practice Location methods
  async getAllPracticeLocations() {
    return Array.from(this.practiceLocations.values()).sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  }
  async getActivePracticeLocations() {
    return Array.from(this.practiceLocations.values()).filter((location) => location.isActive).sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  }
  async getPracticeLocation(id) {
    return this.practiceLocations.get(id);
  }
  async getPracticeLocationByLocationId(locationId) {
    return Array.from(this.practiceLocations.values()).find((location) => location.locationId === locationId);
  }
  async createPracticeLocation(insertLocation) {
    const id = this.locationId++;
    const now = /* @__PURE__ */ new Date();
    const location = {
      id,
      ...insertLocation,
      createdAt: now,
      updatedAt: now
    };
    this.practiceLocations.set(id, location);
    return location;
  }
  async updatePracticeLocation(id, updateData) {
    const existing = this.practiceLocations.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.practiceLocations.set(id, updated);
    return updated;
  }
  async deletePracticeLocation(id) {
    return this.practiceLocations.delete(id);
  }
  async setPrimaryLocation(id) {
    const targetLocation = this.practiceLocations.get(id);
    if (!targetLocation) return false;
    for (const [locationId, location] of this.practiceLocations.entries()) {
      this.practiceLocations.set(locationId, {
        ...location,
        isPrimary: false,
        updatedAt: /* @__PURE__ */ new Date()
      });
    }
    this.practiceLocations.set(id, {
      ...targetLocation,
      isPrimary: true,
      updatedAt: /* @__PURE__ */ new Date()
    });
    return true;
  }
  // Availability methods
  async createAvailability(insertAvailability) {
    const id = this.availabilityId++;
    const availability2 = {
      id,
      date: insertAvailability.date,
      availableSlots: insertAvailability.availableSlots || [],
      createdAt: insertAvailability.createdAt || /* @__PURE__ */ new Date(),
      updatedAt: insertAvailability.updatedAt || /* @__PURE__ */ new Date()
    };
    this.availability.set(id, availability2);
    return availability2;
  }
  async getAllAvailability() {
    return Array.from(this.availability.values());
  }
  async getAvailability(id) {
    return this.availability.get(id);
  }
  async upsertAvailability(date, slots) {
    const existingAvailability = Array.from(this.availability.values()).find((a) => a.date === date);
    if (existingAvailability) {
      const updated = {
        ...existingAvailability,
        availableSlots: slots,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.availability.set(existingAvailability.id, updated);
      return updated;
    }
    const id = this.availabilityId++;
    const newAvailability = {
      id,
      date,
      availableSlots: slots,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.availability.set(id, newAvailability);
    return newAvailability;
  }
  async getAvailabilityRange(startDate, endDate) {
    return Array.from(this.availability.values()).filter((a) => a.date >= startDate && a.date <= endDate);
  }
  async deleteAvailability(date) {
    const availability2 = Array.from(this.availability.values()).find((a) => a.date === date);
    if (availability2) {
      this.availability.delete(availability2.id);
    }
  }
  // Google Calendar methods
  async saveGoogleTokens(tokens) {
    const now = /* @__PURE__ */ new Date();
    this.googleTokensData = {
      id: 1,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiryDate: tokens.expiryDate.toString(),
      // Store as string
      calendarId: tokens.calendarId || null,
      createdAt: now,
      updatedAt: now
    };
    return this.googleTokensData;
  }
  async getGoogleTokens() {
    return this.googleTokensData;
  }
  async updateGoogleTokens(tokens) {
    if (!this.googleTokensData) {
      return null;
    }
    this.googleTokensData = {
      ...this.googleTokensData,
      accessToken: tokens.accessToken,
      expiryDate: tokens.expiryDate.toString(),
      calendarId: tokens.calendarId || this.googleTokensData.calendarId,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.googleTokensData;
  }
  async clearGoogleTokens() {
    this.googleTokensData = null;
    return true;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z as z2 } from "zod";

// shared/schema.ts
import { pgTable, text, serial, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  availableSlots: json("available_slots").$type().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var googleTokens = pgTable("google_tokens", {
  id: serial("id").primaryKey(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiryDate: text("expiry_date").notNull(),
  // Stored as string timestamp number
  calendarId: text("calendar_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  service: json("service").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  client: json("client").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow()
});
var practiceLocations = pgTable("practice_locations", {
  id: serial("id").primaryKey(),
  locationId: text("location_id").notNull().unique(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  coordinates: json("coordinates").$type().notNull(),
  features: json("features").$type().notNull().default([]),
  hours: json("hours").$type(),
  parking: text("parking"),
  transport: json("transport").$type().default([]),
  phone: text("phone"),
  email: text("email"),
  contactPersonName: text("contact_person_name"),
  specialNotes: text("special_notes"),
  accessibilityFeatures: json("accessibility_features").$type().default([]),
  availableServices: json("available_services").$type().default([]),
  sortOrder: serial("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  enquiryType: text("enquiry_type").notNull(),
  preferredLocation: text("preferred_location"),
  message: text("message").notNull(),
  urgencyLevel: serial("urgency_level").default(1),
  privacyConsent: boolean("privacy_consent").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.number(),
  price: z.number(),
  withRebate: z.number().nullable()
});
var clientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  haveReferral: z.boolean().default(false),
  referralDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
  hasMedicare: z.boolean().optional(),
  medicareNumber: z.string().optional(),
  notes: z.string().optional()
});
var insertBookingSchema = z.object({
  service: serviceSchema,
  date: z.string(),
  time: z.string(),
  client: clientSchema
});
var insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  enquiryType: true,
  preferredLocation: true,
  message: true,
  urgencyLevel: true,
  privacyConsent: true
});
var insertPracticeLocationSchema = createInsertSchema(practiceLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var practiceLocationSchema = z.object({
  id: z.number(),
  locationId: z.string(),
  name: z.string(),
  displayName: z.string(),
  address: z.string(),
  description: z.string(),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  features: z.array(z.string()).default([]),
  hours: z.record(z.string()).optional(),
  parking: z.string().optional(),
  transport: z.array(z.string()).default([]),
  phone: z.string().optional(),
  email: z.string().optional(),
  contactPersonName: z.string().optional(),
  specialNotes: z.string().optional(),
  accessibilityFeatures: z.array(z.string()).default([]),
  availableServices: z.array(z.string()).default([]),
  sortOrder: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
var insertAvailabilitySchema = createInsertSchema(availability);
var insertGoogleTokenSchema = createInsertSchema(googleTokens);

// server/email.ts
import { MailService } from "@sendgrid/mail";
var mailService = new MailService();
var apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  let cleanApiKey = apiKey;
  if (apiKey.includes("=")) {
    cleanApiKey = apiKey.split("=")[1].trim();
  }
  mailService.setApiKey(cleanApiKey);
  console.log("SendGrid API key set successfully");
} else {
  console.warn("SENDGRID_API_KEY is not set. Email functionality will be disabled.");
}
async function sendEmail(params) {
  if (!apiKey) {
    console.warn("Email not sent to " + params.to + " - No SendGrid API key");
    return false;
  }
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      // This should be a verified sender in your SendGrid account
      subject: params.subject,
      text: params.text || "",
      html: params.html || ""
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    return false;
  }
}
async function sendContactConfirmation(firstName, lastName, email, message) {
  const subject = "We've Received Your Message - Celia Dunsmore Counselling";
  const fromEmail = "info@celiadunsmorecounselling.com.au";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4EB3A5; margin: 0;">Thank You for Contacting Us</h1>
        <p style="font-size: 18px; color: #666;">Celia Dunsmore Counselling</p>
      </div>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible, usually within 24-48 hours during business days.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #4EB3A5; border-radius: 3px;">
          <p><strong>Your message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <h3 style="color: #4EB3A5;">What happens next?</h3>
        <p>I will review your message and contact you via email or phone. If your matter is urgent, please call me directly at (03) 9123 4567.</p>
      </div>
      
      <div style="text-align: center; font-size: 14px; color: #888; margin-top: 30px;">
        <p>If you have any questions, please contact us at:</p>
        <p>Email: info@celiadunsmorecounselling.com.au | Phone: (03) 9123 4567</p>
        <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Celia Dunsmore Counselling. All rights reserved.</p>
      </div>
    </div>
  `;
  const text2 = `
    Thank You for Contacting Us - Celia Dunsmore Counselling
    
    Dear ${firstName} ${lastName},
    
    Thank you for reaching out. I have received your message and will get back to you as soon as possible, usually within 24-48 hours during business days.
    
    Your message:
    ${message}
    
    What happens next?
    I will review your message and contact you via email or phone. If your matter is urgent, please call me directly at (03) 9123 4567.
    
    If you have any questions, please contact us at:
    Email: info@celiadunsmorecounselling.com.au | Phone: (03) 9123 4567
    
    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Celia Dunsmore Counselling. All rights reserved.
  `;
  return sendEmail({
    to: email,
    from: fromEmail,
    subject,
    html,
    text: text2
  });
}
async function sendBookingConfirmation(booking) {
  const client = typeof booking.client === "string" ? JSON.parse(booking.client) : booking.client;
  const service = typeof booking.service === "string" ? JSON.parse(booking.service) : booking.service;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatTime = (time) => {
    return time;
  };
  const subject = "Your Appointment Confirmation with Celia Dunsmore Counselling";
  const fromEmail = "info@celiadunsmorecounselling.com.au";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4EB3A5; margin: 0;">Appointment Confirmation</h1>
        <p style="font-size: 18px; color: #666;">Celia Dunsmore Counselling</p>
      </div>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <p>Dear ${client.firstName} ${client.lastName},</p>
        <p>Your appointment has been confirmed. Please find the details below:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #4EB3A5; border-radius: 3px;">
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
          <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
          <p><strong>Duration:</strong> ${service.duration} minutes</p>
        </div>
        
        <h3 style="color: #4EB3A5;">Location</h3>
        <p>178 Scotchman Rd, Bellingen NSW 2454</p>
        
        <h3 style="color: #4EB3A5;">Preparation</h3>
        <p>Please arrive 5-10 minutes before your appointment. If this is your first session, please bring any relevant referral letters, Medicare card, and health insurance information if applicable.</p>
        
        <h3 style="color: #4EB3A5;">Cancellation Policy</h3>
        <p>If you need to reschedule or cancel your appointment, please provide at least 24 hours notice to avoid a cancellation fee.</p>
      </div>
      
      <div style="text-align: center; font-size: 14px; color: #888; margin-top: 30px;">
        <p>If you have any questions, please contact us at:</p>
        <p>Email: info@celiadunsmorecounselling.com.au | Phone: 0422 804 479</p>
        <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Celia Dunsmore Counselling. All rights reserved.</p>
      </div>
    </div>
  `;
  const text2 = `
    Appointment Confirmation - Celia Dunsmore Counselling
    
    Dear ${client.firstName} ${client.lastName},
    
    Your appointment has been confirmed. Please find the details below:
    
    Service: ${service.name}
    Date: ${formatDate(booking.date)}
    Time: ${formatTime(booking.time)}
    Duration: ${service.duration} minutes
    
    Location: 178 Scotchman Rd, Bellingen NSW 2454
    
    Preparation:
    Please arrive 5-10 minutes before your appointment. If this is your first session, please bring any relevant referral letters, Medicare card, and health insurance information if applicable.
    
    Cancellation Policy:
    If you need to reschedule or cancel your appointment, please provide at least 24 hours notice to avoid a cancellation fee.
    
    If you have any questions, please contact us at:
    Email: info@celiadunsmorecounselling.com.au | Phone: 0422 804 479
    
    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Celia Dunsmore Counselling. All rights reserved.
  `;
  return sendEmail({
    to: client.email,
    from: fromEmail,
    subject,
    html,
    text: text2
  });
}

// server/ai/mentalHealthAI.ts
import { OpenAI } from "openai";
var MentalHealthAI = class {
  openai = null;
  constructor() {
    const apiKey2 = process.env.OPENAI_API_KEY;
    if (apiKey2) {
      this.openai = new OpenAI({ apiKey: apiKey2 });
    }
  }
  getSystemPrompt() {
    return `You are Compass, an AI assistant for Celia Dunsmore Counselling, a professional mental health practice in Melbourne. 

    CORE IDENTITY & ROLE:
    - You are a warm, professional practice navigator - NOT a therapist or counselor
    - Your role is administrative support, information provision, and crisis resource connection
    - You help clients navigate services, book appointments, and find appropriate resources
    - You maintain strict ethical boundaries around providing therapeutic advice

    PRACTICE INFORMATION:
    - Celia Dunsmore is an Accredited Mental Health Social Worker
    - Three locations: Brunswick (503 Sydney Road), Coburg Bell Street (81B Bell Street), Coburg Solana (420 Sydney Road)
    - Services: Individual counseling, couples counseling, family therapy, trauma therapy
    - Specializes in anxiety, depression, trauma, relationship issues, family dynamics
    - Medicare rebates available for individual sessions with GP referral

    COMMUNICATION STYLE:
    - Australian English, warm and professional
    - Culturally sensitive and inclusive
    - Non-judgmental and empathetic
    - Clear about your limitations as administrative support

    ETHICAL BOUNDARIES:
    - Never provide therapeutic advice or clinical assessments
    - Always identify yourself as administrative support, not a therapist
    - Refer all clinical matters to Celia or appropriate professionals
    - For crisis situations, provide immediate professional resources

    CRISIS PROTOCOL:
    - If someone mentions self-harm, suicide, or immediate danger:
      * Provide immediate crisis resources (Lifeline 13 11 14, Beyond Blue 1300 22 4636)
      * Encourage contacting emergency services (000) if in immediate danger
      * Suggest calling Celia directly for urgent mental health concerns
      * Flag for immediate escalation

    Your responses should be helpful, professional, and always within appropriate boundaries.`;
  }
  async processClientInquiry(message, context = {}) {
    if (!this.openai) {
      return {
        message: "For assistance with your inquiry, please contact Celia directly at (03) 9041 5031 or email info@celiadunsmorecounselling.com.au",
        urgencyLevel: 5,
        shouldEscalate: true,
        suggestedActions: ["Contact practice directly"],
        resources: ["Direct phone: (03) 9041 5031"]
      };
    }
    try {
      const systemPrompt = this.getSystemPrompt();
      let userPrompt = message;
      if (context.name) {
        userPrompt = `Client: ${context.name}
Inquiry: ${message}`;
      }
      if (context.previousMessages && context.previousMessages.length > 0) {
        userPrompt += `

Previous conversation context:
${context.previousMessages.join("\n")}`;
      }
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      const aiMessage = completion.choices[0]?.message?.content || "";
      const analysis = await this.analyzeResponse(message, aiMessage);
      return {
        message: aiMessage,
        urgencyLevel: analysis.urgencyLevel,
        shouldEscalate: analysis.shouldEscalate,
        suggestedActions: analysis.suggestedActions,
        resources: analysis.resources
      };
    } catch (error) {
      console.error("AI processing error:", error);
      return {
        message: "I'm experiencing a technical issue. For immediate assistance, please call Celia directly at (03) 9041 5031 or email info@celiadunsmorecounselling.com.au",
        urgencyLevel: 5,
        shouldEscalate: true,
        suggestedActions: ["Contact practice directly"],
        resources: ["Direct phone: (03) 9041 5031"]
      };
    }
  }
  async analyzeResponse(originalMessage, aiResponse) {
    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end it all",
      "want to die",
      "self-harm",
      "hurt myself",
      "emergency",
      "crisis",
      "urgent",
      "immediate help"
    ];
    const highUrgencyKeywords = [
      "anxiety",
      "panic",
      "depression",
      "trauma",
      "abuse",
      "urgent",
      "help me",
      "desperate",
      "can't cope",
      "overwhelmed"
    ];
    let urgencyLevel = 1;
    let shouldEscalate = false;
    let suggestedActions = [];
    let resources = [];
    const lowerMessage = originalMessage.toLowerCase();
    if (crisisKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      urgencyLevel = 10;
      shouldEscalate = true;
      suggestedActions = [
        "Provide immediate crisis resources",
        "Escalate to emergency services if immediate danger",
        "Connect with Celia urgently"
      ];
      resources = [
        "Emergency: 000",
        "Lifeline: 13 11 14",
        "Beyond Blue: 1300 22 4636",
        "Celia direct: (03) 9041 5031"
      ];
    } else if (highUrgencyKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      urgencyLevel = 7;
      shouldEscalate = true;
      suggestedActions = [
        "Prioritize appointment booking",
        "Provide mental health resources",
        "Follow up within 24 hours"
      ];
      resources = [
        "Book urgent appointment",
        "Beyond Blue: 1300 22 4636",
        "Headspace: 1800 650 890"
      ];
    } else {
      urgencyLevel = 3;
      suggestedActions = [
        "Provide practice information",
        "Assist with appointment booking",
        "Share relevant resources"
      ];
      resources = [
        "Practice locations and hours",
        "Medicare rebate information",
        "Service descriptions"
      ];
    }
    return { urgencyLevel, shouldEscalate, suggestedActions, resources };
  }
  // Factory.ai Enhanced Location Intelligence
  async analyzeLocationMatch(request) {
    const locations = [
      {
        id: "brunswick",
        name: "Brunswick Primary Location",
        features: ["public_transport", "ground_floor", "tram_stop", "street_parking"],
        accessibility: ["ground_floor", "wide_doorways"],
        transport: "excellent"
      },
      {
        id: "coburg-bell",
        name: "Coburg Bell Street",
        features: ["on_site_parking", "weekend_hours", "train_station"],
        accessibility: ["ground_parking", "accessible_entrance"],
        transport: "good"
      },
      {
        id: "coburg-solana",
        name: "Coburg Solana Psychology",
        features: ["professional_centre", "lift_access", "specialist_referrals"],
        accessibility: ["lift_access", "professional_centre"],
        transport: "good"
      }
    ];
    let bestMatch = locations[0];
    let score = 50;
    let reasons = [];
    if (request.transportPreference === "public") {
      if (bestMatch.id === "brunswick") {
        score += 30;
        reasons.push("Excellent public transport with tram stop directly outside");
      }
    } else if (request.transportPreference === "car") {
      bestMatch = locations[1];
      score = 85;
      reasons = ["Free on-site parking available", "8-minute walk from Coburg Station"];
    }
    if (request.accessibilityNeeds && request.accessibilityNeeds.length > 0) {
      if (request.accessibilityNeeds.includes("ground_floor")) {
        if (bestMatch.id === "brunswick") {
          score += 20;
          reasons.push("Ground floor access with no stairs");
        }
      }
    }
    if (request.urgencyLevel && request.urgencyLevel >= 7) {
      reasons.push("Primary location recommended for urgent appointments");
      score += 15;
    }
    return {
      bestMatch: {
        locationId: bestMatch.id,
        name: bestMatch.name,
        score: Math.min(score, 100),
        reasons
      },
      reasoning: reasons,
      alternatives: locations.filter((l) => l.id !== bestMatch.id).map((l) => ({
        locationId: l.id,
        name: l.name,
        score: 60
      })),
      message: `Based on your preferences, ${bestMatch.name} would be ideal for you. ${reasons.join(". ")}.`
    };
  }
  async recommendOptimalLocation(request) {
    const locations = ["brunswick", "coburg-bell", "coburg-solana"];
    let recommendedLocation = "brunswick";
    let reasoning = ["Primary location with comprehensive services"];
    if (request.preferredLocation) {
      if (locations.includes(request.preferredLocation)) {
        recommendedLocation = request.preferredLocation;
        reasoning = ["Client specified preference honored"];
      }
    }
    if (request.urgencyLevel && request.urgencyLevel >= 7) {
      recommendedLocation = "brunswick";
      reasoning = ["Primary location recommended for urgent cases", "Immediate access to primary practitioner"];
    }
    const message = request.message.toLowerCase();
    if (message.includes("parking") || message.includes("car")) {
      recommendedLocation = "coburg-bell";
      reasoning = ["On-site parking available", "Better suited for car access"];
    } else if (message.includes("weekend") || message.includes("saturday")) {
      recommendedLocation = "coburg-bell";
      reasoning = ["Weekend appointments available", "Saturday hours until 1 PM"];
    } else if (message.includes("tram") || message.includes("public transport")) {
      recommendedLocation = "brunswick";
      reasoning = ["Excellent public transport access", "Tram stop directly outside"];
    }
    return {
      locationId: recommendedLocation,
      reasoning
    };
  }
};
function createMentalHealthAI() {
  return new MentalHealthAI();
}

// server/routes.ts
import path from "path";
import fs from "fs";

// server/services/googleCalendar.ts
var googleCalendar_exports = {};
__export(googleCalendar_exports, {
  createEvent: () => createEvent,
  disconnectGoogleCalendar: () => disconnectGoogleCalendar,
  exchangeCodeForTokens: () => exchangeCodeForTokens,
  getAuthUrl: () => getAuthUrl,
  getAvailableTimeSlots: () => getAvailableTimeSlots,
  getRedirectUri: () => getRedirectUri,
  hasValidCredentials: () => hasValidCredentials,
  initializeCalendarClient: () => initializeCalendarClient,
  listCalendars: () => listCalendars,
  listEvents: () => listEvents,
  oauth2Client: () => oauth2Client,
  syncCalendarAvailability: () => syncCalendarAvailability
});
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
var GOOGLE_CLIENT_ID = "1083748795834-9sdqkgt413it0nosnoart9ij551s1nrg.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
console.log("Google OAuth credentials status:");
console.log("GOOGLE_CLIENT_ID present:", !!GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET present:", !!GOOGLE_CLIENT_SECRET);
var getHostname = () => {
  console.log("REPL_SLUG:", process.env.REPL_SLUG);
  console.log("REPL_OWNER:", process.env.REPL_OWNER);
  console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS);
  console.log("REPLIT_DB_URL:", process.env.REPLIT_DB_URL);
  if (process.env.REPLIT_DOMAINS) {
    const url = `https://${process.env.REPLIT_DOMAINS}`;
    console.log("Using REPLIT_DOMAINS URL:", url);
    return url;
  }
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    console.log("Using Replit Owner/Slug URL:", url);
    return url;
  }
  console.log("Using localhost URL");
  return "http://localhost:5000";
};
var REDIRECT_URI = `${getHostname()}/api/google/oauth/callback`;
function getRedirectUri() {
  return REDIRECT_URI;
}
var SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];
var oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
    // Force displaying consent screen for refresh token
  });
}
async function exchangeCodeForTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
    throw new Error("Incomplete tokens received from Google");
  }
  await storage.saveGoogleTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiryDate: tokens.expiry_date
    // this is a number (timestamp)
  });
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date
  };
}
async function initializeCalendarClient() {
  const tokens = await storage.getGoogleTokens();
  if (!tokens) {
    return null;
  }
  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: parseInt(tokens.expiryDate)
  });
  return google.calendar({ version: "v3", auth: oauth2Client });
}
async function listCalendars() {
  const calendar = await initializeCalendarClient();
  if (!calendar) {
    return null;
  }
  try {
    const response = await calendar.calendarList.list();
    return response.data.items || [];
  } catch (error) {
    console.error("Error listing calendars:", error);
    return null;
  }
}
async function listEvents(calendarId, startDate, endDate) {
  const calendar = await initializeCalendarClient();
  if (!calendar) {
    return null;
  }
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime"
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Error listing events:", error);
    return null;
  }
}
async function createEvent(calendarId, summary, description, startDateTime, endDateTime, attendees = []) {
  const calendar = await initializeCalendarClient();
  if (!calendar) {
    return null;
  }
  try {
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Australia/Sydney"
        // Use appropriate timezone for Australia
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Australia/Sydney"
      },
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          // 1 day
          { method: "popup", minutes: 30 }
        ]
      }
    };
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: "all"
      // Send email notifications to attendees
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}
async function getAvailableTimeSlots(calendarId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const events = await listEvents(calendarId, startOfDay, endOfDay);
  if (!events) {
    return null;
  }
  const allTimeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    allTimeSlots.push(`${hour}:00`);
  }
  const busySlots = events.filter((event) => !event.transparency || event.transparency !== "transparent").map((event) => {
    const start = new Date(event.start?.dateTime || "");
    return `${start.getHours()}:00`;
  });
  return allTimeSlots.filter((slot) => !busySlots.includes(slot));
}
async function syncCalendarAvailability(calendarId, startDate, endDate) {
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const availableSlots = await getAvailableTimeSlots(calendarId, currentDate);
    if (availableSlots) {
      const dateString = currentDate.toISOString().split("T")[0];
      await storage.upsertAvailability(dateString, availableSlots);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return true;
}
async function hasValidCredentials() {
  const tokens = await storage.getGoogleTokens();
  return !!tokens && !!tokens.refreshToken;
}
async function disconnectGoogleCalendar() {
  return await storage.clearGoogleTokens();
}

// server/services/mockGoogleCalendar.ts
var mockGoogleCalendar_exports = {};
__export(mockGoogleCalendar_exports, {
  connectMockGoogleCalendar: () => connectMockGoogleCalendar,
  createEvent: () => createEvent2,
  disconnectGoogleCalendar: () => disconnectGoogleCalendar2,
  exchangeCodeForTokens: () => exchangeCodeForTokens2,
  getAuthUrl: () => getAuthUrl2,
  getAvailableTimeSlots: () => getAvailableTimeSlots2,
  getRedirectUri: () => getRedirectUri2,
  hasValidCredentials: () => hasValidCredentials2,
  listCalendars: () => listCalendars2,
  listEvents: () => listEvents2,
  syncCalendarAvailability: () => syncCalendarAvailability2
});
import { format } from "date-fns";
var MOCK_CALENDARS = [
  { id: "primary", summary: "My Primary Calendar" },
  { id: "work", summary: "Work Calendar" },
  { id: "personal", summary: "Personal Events" }
];
var REDIRECT_URI2 = "https://workspace.thomarse5150.repl.co/api/google/oauth/callback";
var isConnected = false;
function getRedirectUri2() {
  return REDIRECT_URI2;
}
function getAuthUrl2() {
  return "https://mockgoogleauth.example.com/auth";
}
async function exchangeCodeForTokens2(code) {
  console.log("Mock implementation: Using code to authorize:", code);
  await storage.saveGoogleTokens({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiryDate: Date.now() + 3600 * 1e3,
    // 1 hour from now
    calendarId: "primary"
  });
  isConnected = true;
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expiry_date: Date.now() + 3600 * 1e3
  };
}
async function connectMockGoogleCalendar() {
  await storage.saveGoogleTokens({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiryDate: Date.now() + 3600 * 1e3,
    // 1 hour from now
    calendarId: "primary"
  });
  isConnected = true;
  return true;
}
async function hasValidCredentials2() {
  const tokens = await storage.getGoogleTokens();
  return !!tokens && !!tokens.refreshToken;
}
async function listCalendars2() {
  if (!isConnected && !await hasValidCredentials2()) {
    return null;
  }
  return MOCK_CALENDARS;
}
async function syncCalendarAvailability2(calendarId, startDate, endDate) {
  if (!isConnected && !await hasValidCredentials2()) {
    await connectMockGoogleCalendar();
  }
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const availableSlots = isWeekend ? [] : generateAvailableSlotsForDate(currentDate);
    const dateString = format(currentDate, "yyyy-MM-dd");
    await storage.upsertAvailability(dateString, availableSlots);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return true;
}
function generateAvailableSlotsForDate(date) {
  const allTimeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
  ];
  const availableSlots = allTimeSlots.filter(() => Math.random() > 0.3);
  return availableSlots;
}
async function listEvents2(calendarId, startDate, endDate) {
  return [];
}
async function createEvent2(calendarId, summary, description, startDateTime, endDateTime, attendees = []) {
  return { id: "mock-event-id", summary, description };
}
async function getAvailableTimeSlots2(calendarId, date) {
  return generateAvailableSlotsForDate(date);
}
async function disconnectGoogleCalendar2() {
  isConnected = false;
  return await storage.clearGoogleTokens();
}

// server/routes.ts
var googleCalendar = googleCalendar_exports;
var googleCalendarImplementations = {
  real: googleCalendar_exports,
  mock: mockGoogleCalendar_exports
};
async function registerRoutes(app2) {
  app2.get("/favicon.ico", (req, res) => {
    console.log("Redirecting from favicon.ico to favicon-32x32.png");
    res.redirect("/favicon-32x32.png");
  });
  app2.get("/sitemap.xml", (req, res) => {
    try {
      const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
      if (fs.existsSync(sitemapPath)) {
        const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
        res.header("Content-Type", "text/xml");
        console.log("Serving sitemap.xml directly from file");
        return res.send(sitemapContent);
      } else {
        console.error("Sitemap file not found at path:", sitemapPath);
        res.status(404).send("Sitemap not found");
      }
    } catch (error) {
      console.error("Error serving sitemap:", error);
      res.status(500).send("Error serving sitemap");
    }
  });
  app2.get("/api/sitemap", (req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
      res.setHeader("Content-Type", "text/xml");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.status(200).send(sitemapContent);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });
  app2.get("/api/download-backup", (req, res) => {
    const backupPath = path.join(process.cwd(), "backups", "website-backup-20250501140412.zip");
    if (fs.existsSync(backupPath)) {
      res.download(backupPath);
    } else {
      res.status(404).send("Backup file not found");
    }
  });
  app2.get("/api/download-cdc20", (req, res) => {
    const cdc20Path = path.join(process.cwd(), "CDC20.zip");
    if (fs.existsSync(cdc20Path)) {
      res.download(cdc20Path, "CDC20.zip");
    } else {
      res.status(404).send("CDC20 backup file not found");
    }
  });
  app2.get("/website-enhancement-summary", (req, res) => {
    const summaryHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Enhancement Summary - Celia Dunsmore Counselling</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 40px 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 32px;
        }
        
        .section-title {
            color: #10b981;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .checkmark {
            width: 20px;
            height: 20px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .improvement-list {
            background: #f7fafc;
            border-radius: 12px;
            padding: 24px;
            border-left: 4px solid #10b981;
        }
        
        .improvement-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
            padding: 8px 0;
        }
        
        .improvement-item:last-child {
            margin-bottom: 0;
        }
        
        .bullet {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            margin-top: 8px;
            flex-shrink: 0;
        }
        
        .impact-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #a7f3d0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }
        
        .impact-title {
            color: #047857;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 12px;
        }
        
        .next-steps {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
        }
        
        .next-steps-title {
            color: #92400e;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 12px;
        }
        
        .footer {
            background: #f8fafc;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        
        @media print {
            body {
                background: white;
                padding: 20px;
            }
            .container {
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Website Enhancement Summary</h1>
            <p>Celia Dunsmore Counselling | June 2025</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">
                    <span class="checkmark">\u2713</span>
                    What We've Accomplished
                </h2>
                <div class="improvement-list">
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>
                            <strong>Enhanced Google Visibility:</strong> Your practice locations in Brunswick and Coburg are now properly recognized by Google search
                        </div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>
                            <strong>Mobile Experience:</strong> Improved navigation and touch interactions for smartphone and tablet users
                        </div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>
                            <strong>Accessibility:</strong> Added features to support clients with different abilities and assistive technologies
                        </div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>
                            <strong>Search Engine Optimization:</strong> Technical improvements to help potential clients find your practice online
                        </div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>
                            <strong>Performance Monitoring:</strong> System in place to ensure your website loads quickly and efficiently
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="impact-box">
                <div class="impact-title">Immediate Benefits for Your Practice</div>
                <div class="improvement-item">
                    <span class="bullet"></span>
                    <div>Google is already processing your updated business information</div>
                </div>
                <div class="improvement-item">
                    <span class="bullet"></span>
                    <div>Potential clients will have an easier time navigating your website</div>
                </div>
                <div class="improvement-item">
                    <span class="bullet"></span>
                    <div>Your practice will appear more professional and accessible online</div>
                </div>
                <div class="improvement-item">
                    <span class="bullet"></span>
                    <div>Better visibility in Melbourne-area counselling searches</div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">
                    <span class="checkmark">\u2713</span>
                    Technical Improvements
                </h2>
                <div class="improvement-list">
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>Search engine crawling optimization with robots.txt file</div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>Dynamic sitemap generation for better search indexing</div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>FAQ structured data for Google featured snippets</div>
                    </div>
                    <div class="improvement-item">
                        <span class="bullet"></span>
                        <div>Performance monitoring for website speed optimization</div>
                    </div>
                </div>
            </div>
            
            <div class="next-steps">
                <div class="next-steps-title">Looking Forward</div>
                <p>Your website now has a solid technical foundation. Future enhancements could include additional service pages, advanced booking features, or client testimonials to further grow your online presence.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Website enhancement completed June 2025 | Celia Dunsmore Counselling</p>
            <p>Professional counselling services in Melbourne's inner north</p>
        </div>
    </div>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(summaryHTML);
  });
  app2.get("/api/download-summary", (req, res) => {
    const summaryHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Enhancement Summary - Celia Dunsmore Counselling</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d3748; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; }
        .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .header p { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px; }
        .section { margin-bottom: 32px; }
        .section-title { color: #10b981; font-size: 20px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .checkmark { width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; }
        .improvement-list { background: #f7fafc; border-radius: 12px; padding: 24px; border-left: 4px solid #10b981; }
        .improvement-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; padding: 8px 0; }
        .improvement-item:last-child { margin-bottom: 0; }
        .bullet { width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
        .impact-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .impact-title { color: #047857; font-weight: 600; font-size: 18px; margin-bottom: 12px; }
        .next-steps { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin-top: 32px; }
        .next-steps-title { color: #92400e; font-weight: 600; font-size: 18px; margin-bottom: 12px; }
        .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
        @media print { body { background: white; padding: 20px; } .container { box-shadow: none; border: 1px solid #e2e8f0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Website Enhancement Summary</h1>
            <p>Celia Dunsmore Counselling | June 2025</p>
        </div>
        <div class="content">
            <div class="section">
                <h2 class="section-title"><span class="checkmark">\u2713</span>What We've Accomplished</h2>
                <div class="improvement-list">
                    <div class="improvement-item"><span class="bullet"></span><div><strong>Enhanced Google Visibility:</strong> Your practice locations in Brunswick and Coburg are now properly recognized by Google search</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div><strong>Mobile Experience:</strong> Improved navigation and touch interactions for smartphone and tablet users</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div><strong>Accessibility:</strong> Added features to support clients with different abilities and assistive technologies</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div><strong>Search Engine Optimization:</strong> Technical improvements to help potential clients find your practice online</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div><strong>Performance Monitoring:</strong> System in place to ensure your website loads quickly and efficiently</div></div>
                </div>
            </div>
            <div class="impact-box">
                <div class="impact-title">Immediate Benefits for Your Practice</div>
                <div class="improvement-item"><span class="bullet"></span><div>Google is already processing your updated business information</div></div>
                <div class="improvement-item"><span class="bullet"></span><div>Potential clients will have an easier time navigating your website</div></div>
                <div class="improvement-item"><span class="bullet"></span><div>Your practice will appear more professional and accessible online</div></div>
                <div class="improvement-item"><span class="bullet"></span><div>Better visibility in Melbourne-area counselling searches</div></div>
            </div>
            <div class="section">
                <h2 class="section-title"><span class="checkmark">\u2713</span>Technical Improvements</h2>
                <div class="improvement-list">
                    <div class="improvement-item"><span class="bullet"></span><div>Search engine crawling optimization with robots.txt file</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div>Dynamic sitemap generation for better search indexing</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div>FAQ structured data for Google featured snippets</div></div>
                    <div class="improvement-item"><span class="bullet"></span><div>Performance monitoring for website speed optimization</div></div>
                </div>
            </div>
            <div class="next-steps">
                <div class="next-steps-title">Looking Forward</div>
                <p>Your website now has a solid technical foundation. Future enhancements could include additional service pages, advanced booking features, or client testimonials to further grow your online presence.</p>
            </div>
        </div>
        <div class="footer">
            <p>Website enhancement completed June 2025 | Celia Dunsmore Counselling</p>
            <p>Professional counselling services in Melbourne's inner north</p>
        </div>
    </div>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="Website-Enhancement-Summary-Celia-Dunsmore.html"');
    res.send(summaryHTML);
  });
  app2.post("/api/admin/availability", async (req, res) => {
    try {
      const { date, slots } = req.body;
      const result = await storage.upsertAvailability(date, slots);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });
  app2.get("/api/admin/availability/dates", async (req, res) => {
    try {
      const { year, month } = req.query;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;
      const availability2 = await storage.getAvailabilityRange(startDate, endDate);
      res.json(availability2);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve availability" });
    }
  });
  app2.get("/api/admin/availability", async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates required" });
      }
      const availability2 = await storage.getAvailabilityRange(start, end);
      res.json(availability2);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve availability" });
    }
  });
  app2.get("/api/test-json", (req, res) => {
    console.log("Test JSON endpoint hit");
    res.json({ success: true, message: "This is a test JSON response" });
  });
  app2.get("/api/config/maps", (req, res) => {
    let apiKey2 = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey2) {
      return res.status(500).json({ error: "Google Maps API key not configured" });
    }
    if (apiKey2.includes("=")) {
      apiKey2 = apiKey2.split("=")[1].trim();
    }
    res.json({ apiKey: apiKey2 });
  });
  app2.get("/api/auth/google", (req, res) => {
    try {
      console.log("Redirect URI for Google OAuth:", googleCalendar.getRedirectUri());
      const authUrl = googleCalendar.getAuthUrl();
      console.log("Generated Google Auth URL:", authUrl);
      if (req.query.manual === "true") {
        console.log("Manual auth flow requested, returning JSON with auth URL");
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        console.log("Sending JSON response with authUrl:", authUrl);
        return res.json({ authUrl });
      }
      res.redirect(authUrl);
    } catch (error) {
      console.error("Error generating Google auth URL:", error);
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  });
  app2.post("/api/google/manual-auth", async (req, res) => {
    try {
      let { code, useMock } = req.body;
      if (useMock || code === "mock-auth-code") {
        console.log("Using mock Google Calendar implementation for authorization");
        try {
          const tokens = await googleCalendarImplementations.mock.exchangeCodeForTokens("mock-auth-code");
          console.log("Successfully connected with mock implementation");
          return res.status(200).json({ success: true });
        } catch (mockError) {
          console.error("Error with mock implementation:", mockError);
          return res.status(500).json({ error: "Mock implementation failed" });
        }
      }
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "No authorization code provided" });
      }
      if (code.includes("&")) {
        code = code.split("&")[0];
        console.log("Cleaned up authorization code to:", code);
      }
      console.log("Attempting to exchange manually provided code for tokens...");
      try {
        const tokens = await googleCalendar.exchangeCodeForTokens(code);
        console.log("Successfully exchanged code for tokens");
        return res.status(200).json({ success: true });
      } catch (tokenError) {
        console.error("Error exchanging code for tokens:", tokenError);
        return res.status(400).json({
          error: tokenError instanceof Error ? tokenError.message : "Invalid authorization code"
        });
      }
    } catch (error) {
      console.error("Manual auth error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({ error: errorMessage });
    }
  });
  app2.get("/api/google/oauth/callback", async (req, res) => {
    try {
      console.log("Google OAuth callback received with query params:", req.query);
      if (req.query.error) {
        console.error("Google OAuth error:", req.query.error);
        return res.redirect(`/admin/calendar?error=${encodeURIComponent(req.query.error)}`);
      }
      const { code } = req.query;
      if (!code || typeof code !== "string") {
        throw new Error("No code provided");
      }
      console.log("Attempting to exchange code for tokens...");
      const tokens = await googleCalendar.exchangeCodeForTokens(code);
      console.log("Successfully exchanged code for tokens");
      res.redirect("/admin/calendar?success=true");
    } catch (error) {
      console.error("OAuth callback error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.redirect(`/admin/calendar?error=${encodeURIComponent(errorMessage)}`);
    }
  });
  app2.get("/api/google/calendars", async (req, res) => {
    try {
      const tokens = await storage.getGoogleTokens();
      const isMockAuth = tokens && tokens.accessToken === "mock-access-token";
      if (isMockAuth) {
        console.log("Using mock implementation for calendars list");
        const mockCalendars = await googleCalendarImplementations.mock.listCalendars();
        return res.json(mockCalendars);
      }
      const calendars = await googleCalendar.listCalendars();
      if (!calendars) {
        return res.status(401).json({ message: "Not authenticated with Google Calendar" });
      }
      res.json(calendars);
    } catch (error) {
      console.error("Error listing calendars:", error);
      res.status(500).json({ message: "Failed to list calendars" });
    }
  });
  app2.get("/api/google/status", async (req, res) => {
    try {
      const isConnected2 = await googleCalendar.hasValidCredentials();
      res.json({ connected: isConnected2 });
    } catch (error) {
      res.status(500).json({ connected: false, error: "Failed to check Google connection status" });
    }
  });
  app2.post("/api/google/sync", async (req, res) => {
    try {
      const { calendarId, startDate, endDate } = req.body;
      if (!calendarId || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      const syncResult = await googleCalendar.syncCalendarAvailability(
        calendarId,
        new Date(startDate),
        new Date(endDate)
      );
      res.json({ success: syncResult });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ message: "Failed to sync with Google Calendar" });
    }
  });
  app2.post("/api/google/disconnect", async (req, res) => {
    try {
      const result = await googleCalendar.disconnectGoogleCalendar();
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect from Google Calendar" });
    }
  });
  app2.delete("/api/admin/availability/:date", async (req, res) => {
    try {
      await storage.deleteAvailability(req.params.date);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete availability" });
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getAllBookings();
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve bookings" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      try {
        await sendBookingConfirmation(booking);
        console.log("Booking confirmation email sent");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });
  app2.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve booking" });
    }
  });
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const ai = createMentalHealthAI();
      const response = await ai.processClientInquiry(message, context);
      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        message: "For assistance, please contact Celia directly at (03) 9041 5031",
        urgencyLevel: 5,
        shouldEscalate: true,
        suggestedActions: ["Contact practice directly"],
        resources: ["Direct phone: (03) 9041 5031"]
      });
    }
  });
  app2.get("/api/locations", async (req, res) => {
    try {
      const locations = [
        {
          id: "brunswick",
          name: "Brunswick",
          displayName: "Brunswick Primary Location",
          address: "503 Sydney Road, Brunswick VIC 3056",
          description: "Primary location with excellent public transport access",
          isPrimary: true,
          coordinates: { lat: -37.7749, lng: 144.9631 },
          features: ["Ground floor access", "Tram stop directly outside", "Street parking available"],
          hours: {
            "Monday": "9:00 AM - 5:00 PM",
            "Tuesday": "9:00 AM - 5:00 PM",
            "Wednesday": "9:00 AM - 5:00 PM",
            "Thursday": "9:00 AM - 5:00 PM",
            "Friday": "9:00 AM - 5:00 PM"
          },
          parking: "Street parking available on Sydney Road",
          transport: ["Tram 19", "Bus 506"],
          phone: "0438 593 071",
          accessibilityFeatures: ["Ground floor access", "Wide doorways"],
          availableServices: ["Individual counselling", "Telehealth"]
        },
        {
          id: "coburg-bell",
          name: "Coburg Bell Street",
          displayName: "Coburg - Bell Street Location",
          address: "81B Bell Street, Coburg VIC 3058",
          description: "Convenient location with fortnightly appointments",
          isPrimary: false,
          coordinates: { lat: -37.7559, lng: 144.9647 },
          features: ["Limited street parking", "8 minute walk from Coburg Station", "Fortnightly appointments"],
          hours: {
            "Monday": "9:00 AM - 5:00 PM",
            "Tuesday": "9:00 AM - 5:00 PM",
            "Wednesday": "9:00 AM - 5:00 PM",
            "Thursday": "9:00 AM - 5:00 PM",
            "Friday": "9:00 AM - 5:00 PM"
          },
          parking: "Limited street parking",
          transport: ["Train to Coburg Station", "Bus 508"],
          phone: "0438 593 071",
          accessibilityFeatures: ["Ground floor access"],
          availableServices: ["Individual counselling", "Fortnightly appointments"]
        },
        {
          id: "coburg-solana",
          name: "Coburg Solana Psychology",
          displayName: "Coburg - Solana Psychology Partnership",
          address: "Solana Psychology, FL 1, 420 Sydney Road, Coburg VIC 3058",
          description: "Partnership location with comprehensive psychology services",
          isPrimary: false,
          coordinates: { lat: -37.7401, lng: 144.9631 },
          features: ["First floor with lift access", "Near Coburg Station", "Professional psychology centre"],
          hours: {
            "Monday": "9:00 AM - 5:00 PM",
            "Tuesday": "9:00 AM - 5:00 PM",
            "Wednesday": "9:00 AM - 5:00 PM",
            "Thursday": "9:00 AM - 5:00 PM",
            "Friday": "9:00 AM - 5:00 PM"
          },
          parking: "Off-street parking available",
          transport: ["Train to Coburg Station", "Tram 19"],
          phone: "0438 593 071",
          accessibilityFeatures: ["Ground floor access", "Professional centre"],
          availableServices: ["Individual counselling", "Monthly appointments"]
        }
      ];
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });
  app2.post("/api/locations/recommend", async (req, res) => {
    try {
      const { clientLocation, transportPreference, accessibilityNeeds, urgencyLevel } = req.body;
      const ai = createMentalHealthAI();
      const recommendation = await ai.analyzeLocationMatch({
        clientLocation,
        transportPreference,
        accessibilityNeeds,
        urgencyLevel
      });
      res.json({
        recommendedLocation: recommendation.bestMatch,
        reasoning: recommendation.reasoning,
        alternativeOptions: recommendation.alternatives,
        personalizedMessage: recommendation.message
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate location recommendation" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const ai = createMentalHealthAI();
      const aiAnalysis = await ai.processClientInquiry(contactData.message, {
        name: `${contactData.firstName} ${contactData.lastName}`,
        email: contactData.email,
        inquiryType: contactData.enquiryType,
        preferredLocation: contactData.preferredLocation
      });
      const locationRecommendation = await ai.recommendOptimalLocation({
        message: contactData.message,
        preferredLocation: contactData.preferredLocation,
        urgencyLevel: aiAnalysis.urgencyLevel
      });
      const contact = await storage.createContact(contactData);
      try {
        const { firstName, lastName, email, message } = contactData;
        const emailSent = await sendContactConfirmation(firstName, lastName, email, message);
        console.log(`Contact confirmation email ${emailSent ? "sent" : "failed"} for: ${email}`);
      } catch (emailError) {
        console.error("Failed to send contact confirmation email:", emailError);
      }
      res.status(201).json({
        message: "Message sent successfully",
        id: contact.id,
        aiInsights: {
          urgencyLevel: aiAnalysis.urgencyLevel,
          shouldEscalate: aiAnalysis.shouldEscalate,
          suggestedActions: aiAnalysis.suggestedActions,
          recommendedLocation: locationRecommendation.locationId,
          locationReasoning: locationRecommendation.reasoning
        }
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });
  app2.get("/api/admin/contacts", async (req, res) => {
    try {
      const adminToken = req.headers.authorization?.split(" ")[1];
      const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "celia-admin-token";
      if (adminToken !== ADMIN_TOKEN) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const contacts2 = await storage.getAllContacts();
      contacts2.sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      res.json(contacts2);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import fs3 from "fs";
import path4 from "path";
import { fileURLToPath } from "url";

// server/staticRoutes.ts
import express2 from "express";
var router = express2.Router();
var staticRoutes_default = router;

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path4.dirname(__filename);
var app = express3();
app.use(staticRoutes_default);
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.get("/favicon.ico", (_req, res) => {
  console.log("Favicon.ico route hit!");
  res.setHeader("Content-Type", "image/x-icon");
  res.setHeader("Cache-Control", "public, max-age=86400");
  try {
    const iconPath = path4.join(__dirname, "../client/public/favicon.ico");
    const icon = fs3.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error("Error serving favicon.ico:", error);
    try {
      const pngPath = path4.join(__dirname, "../client/public/favicon-32x32.png");
      const pngIcon = fs3.readFileSync(pngPath);
      res.setHeader("Content-Type", "image/png");
      res.send(pngIcon);
    } catch (fallbackError) {
      console.error("Error serving fallback favicon:", fallbackError);
      res.status(404).send("Not found");
    }
  }
});
app.get("/favicon-32x32.png", (_req, res) => {
  console.log("Favicon-32x32.png route hit!");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400");
  try {
    const iconPath = path4.join(process.cwd(), "client/public/favicon-32x32.png");
    const icon = fs3.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error("Error serving favicon-32x32.png:", error);
    res.status(404).send("Not found");
  }
});
app.get("/apple-touch-icon.png", (_req, res) => {
  console.log("Apple-touch-icon.png route hit!");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400");
  try {
    const iconPath = path4.join(__dirname, "../client/public/apple-touch-icon.png");
    const icon = fs3.readFileSync(iconPath);
    res.send(icon);
  } catch (error) {
    console.error("Error serving apple-touch-icon.png:", error);
    res.status(404).send("Not found");
  }
});
app.use((req, res, next) => {
  if (process.env.REPLIT_DOMAINS) {
    return next();
  }
  const hostHeader = req.headers.host || "";
  const userAgent = req.headers["user-agent"] || "";
  if (!hostHeader.startsWith("www.") && hostHeader.includes(".") && !hostHeader.startsWith("localhost") && !/^(\d{1,3}\.){3}\d{1,3}/.test(hostHeader)) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const newUrl = `${protocol}://www.${hostHeader}${req.originalUrl}`;
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    if (userAgent.includes("Chrome")) {
      res.setHeader("Clear-Site-Data", '"cache", "cookies", "storage"');
    }
    const statusCode = userAgent.includes("Chrome") ? 307 : 301;
    return res.redirect(statusCode, newUrl);
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.get("/googlee964abc67dc1d83e.html", (_req, res) => {
    res.type("text/html");
    res.send("google-site-verification: googlee964abc67dc1d83e.html");
  });
  app.get("/sitemap.xml", (req, res) => {
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
    res.type("text/xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(sitemapContent);
    console.log("Serving hardcoded sitemap.xml content");
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
