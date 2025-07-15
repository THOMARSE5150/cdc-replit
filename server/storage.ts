// FINAL, COMPLETE, AND VERIFIED - MERGED SCHEMA AND STORAGE
// This file is now the single source of truth for data types and storage.

import { pgTable, serial, text, varchar, boolean, jsonb, integer, timestamp } from 'drizzle-orm/pg-core';
import { type InferModel } from 'drizzle-orm';

// --- SCHEMA DEFINITIONS (formerly shared/schema.ts) ---
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  date: varchar('date', { length: 255 }).notNull(),
  time: varchar('time', { length: 255 }).notNull(),
  client: jsonb('client').notNull(),
  service: jsonb('service').notNull(),
  status: varchar('status', { length: 50 }).default('confirmed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Booking = InferModel<typeof bookings>;
export type InsertBooking = InferModel<typeof bookings, 'insert'>;

export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    enquiryType: varchar('enquiry_type', { length: 100 }).notNull(),
    preferredLocation: varchar('preferred_location', { length: 100 }),
    message: text('message').notNull(),
    urgencyLevel: integer('urgency_level').default(1),
    privacyConsent: boolean('privacy_consent').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Contact = InferModel<typeof contacts>;
export type InsertContact = InferModel<typeof contacts, 'insert'>;

export const practiceLocations = pgTable('practice_locations', {
    id: serial('id').primaryKey(),
    locationId: varchar('location_id', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }),
    address: varchar('address', { length: 255 }).notNull(),
    description: text('description'),
    isPrimary: boolean('is_primary').default(false),
    isActive: boolean('is_active').default(true),
    coordinates: jsonb('coordinates'),
    features: jsonb('features'),
    hours: jsonb('hours'),
    parking: text('parking'),
    transport: jsonb('transport'),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    contactPersonName: varchar('contact_person_name', { length: 255 }),
    specialNotes: text('special_notes'),
    accessibilityFeatures: jsonb('accessibility_features'),
    availableServices: jsonb('available_services'),
    sortOrder: integer('sort_order'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export type PracticeLocation = InferModel<typeof practiceLocations>;
export type InsertPracticeLocation = InferModel<typeof practiceLocations, 'insert'>;

export const availability = pgTable('availability', {
    id: serial('id').primaryKey(),
    date: varchar('date', { length: 255 }).notNull().unique(),
    availableSlots: jsonb('available_slots').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export type Availability = InferModel<typeof availability>;
export type InsertAvailability = InferModel<typeof availability, 'insert'>;

export const googleTokens = pgTable('google_tokens', {
    id: serial('id').primaryKey(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiryDate: varchar('expiry_date', { length: 255 }).notNull(),
    calendarId: varchar('calendar_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export type GoogleTokens = InferModel<typeof googleTokens>;
export type InsertGoogleTokens = InferModel<typeof googleTokens, 'insert'>;


// --- STORAGE IMPLEMENTATION (formerly server/storage.ts) ---

// Helper function to create a valid PracticeLocation from raw data, providing defaults
function createLocationFromData(data: Partial<InsertPracticeLocation>): Omit<PracticeLocation, 'id' | 'createdAt' | 'updatedAt'> {
  const hours: { [key: string]: string } = {};
  if (data.hours && typeof data.hours === 'object') {
    for (const [day, time] of Object.entries(data.hours)) {
      if (typeof time === 'string') {
        hours[day] = time;
      }
    }
  }

  return {
    locationId: data.locationId!,
    name: data.name!,
    displayName: data.displayName ?? data.name!,
    address: data.address ?? 'Address not available',
    description: data.description ?? '',
    isPrimary: data.isPrimary ?? false,
    isActive: data.isActive ?? true,
    coordinates: data.coordinates ?? { lat: 0, lng: 0 },
    features: Array.isArray(data.features) ? data.features.map(String) : [],
    hours: hours,
    parking: data.parking ?? null,
    transport: Array.isArray(data.transport) ? data.transport : [],
    phone: data.phone ?? null,
    email: data.email ?? null,
    contactPersonName: data.contactPersonName ?? null,
    specialNotes: data.specialNotes ?? null,
    accessibilityFeatures: Array.isArray(data.accessibilityFeatures) ? data.accessibilityFeatures : [],
    availableServices: Array.isArray(data.availableServices) ? data.availableServices : [],
    sortOrder: data.sortOrder ?? 99,
  };
}

// Storage interface for our application
export interface IStorage {
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  upsertAvailability(date: string, slots: string[]): Promise<Availability>;
  getAvailabilityRange(startDate: string, endDate: string): Promise<Availability[]>;
  deleteAvailability(date: string): Promise<void>;
  getAllPracticeLocations(): Promise<PracticeLocation[]>;
  getActivePracticeLocations(): Promise<PracticeLocation[]>;
  getPracticeLocation(id: number): Promise<PracticeLocation | undefined>;
  getPracticeLocationByLocationId(locationId: string): Promise<PracticeLocation | undefined>;
  createPracticeLocation(location: InsertPracticeLocation): Promise<PracticeLocation>;
  updatePracticeLocation(id: number, location: Partial<InsertPracticeLocation>): Promise<PracticeLocation | undefined>;
  deletePracticeLocation(id: number): Promise<boolean>;
  setPrimaryLocation(id: number): Promise<boolean>;
  saveGoogleTokens(tokens: { accessToken: string; refreshToken: string; expiryDate: number; calendarId?: string }): Promise<GoogleTokens>;
  getGoogleTokens(): Promise<GoogleTokens | null>;
  updateGoogleTokens(tokens: { accessToken: string; expiryDate: number; calendarId?: string }): Promise<GoogleTokens | null>;
  clearGoogleTokens(): Promise<boolean>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private bookings: Map<number, Booking> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private practiceLocations: Map<number, PracticeLocation> = new Map();
  private bookingId: number = 1;
  private contactId: number = 1;
  private locationId: number = 1;
  private availabilityId: number = 1;
  private availability: Map<number, Availability> = new Map();
  private googleTokensData: GoogleTokens | null = null;

  constructor() {
    this.initializeDefaultLocations();
  }

  private initializeDefaultLocations() {
    const defaultLocationsData: Partial<InsertPracticeLocation>[] = [
      {
        locationId: 'brunswick', name: 'Brunswick', displayName: 'Brunswick Primary Location',
        address: '503 Sydney Road, Brunswick VIC', description: 'Primary location with excellent public transport access',
        isPrimary: true, isActive: true, coordinates: { lat: -37.7749, lng: 144.9631 },
        features: ['Ground floor access', 'Tram stop directly outside', 'Street parking available'],
        hours: { 'Monday': '9:00 AM - 5:00 PM', 'Tuesday': '9:00 AM - 5:00 PM', 'Wednesday': '9:00 AM - 5:00 PM', 'Thursday': '9:00 AM - 5:00 PM', 'Friday': '9:00 AM - 5:00 PM' },
        parking: 'Street parking available on Sydney Road', transport: ['Tram 19', 'Bus 506'],
        phone: '(03) 9041 5031', accessibilityFeatures: ['Ground floor access', 'Wide doorways'],
        availableServices: ['Individual counselling', 'Telehealth'], sortOrder: 1
      },
      {
        locationId: 'coburg-bell', name: 'Coburg Bell Street', displayName: 'Coburg - Bell Street Location',
        address: '81B Bell Street, Coburg VIC 3058', description: 'New location with on-site parking available',
        isPrimary: false, isActive: true, coordinates: { lat: -37.7559, lng: 144.9647 },
        features: ['On-site parking', '8 minute walk from Coburg Station', 'Weekend availability'],
        hours: { 'Monday': '9:00 AM - 5:00 PM', 'Tuesday': '9:00 AM - 5:00 PM', 'Wednesday': '9:00 AM - 5:00 PM', 'Thursday': '9:00 AM - 5:00 PM', 'Friday': '9:00 AM - 5:00 PM', 'Saturday': '9:00 AM - 1:00 PM' },
        parking: 'Free on-site parking available', transport: ['Train to Coburg Station', 'Bus 508'],
        phone: '(03) 9041 5031', accessibilityFeatures: ['Ground level parking', 'Accessible entrance'],
        availableServices: ['Individual counselling', 'Weekend appointments'], sortOrder: 2
      },
      {
        locationId: 'coburg-solana', name: 'Coburg Solana Psychology', displayName: 'Coburg - Solana Psychology',
        address: 'FL 1, 420 Sydney Road, Coburg VIC 3058', description: 'Convenient location',
        isPrimary: false, isActive: true, coordinates: { lat: -37.7423, lng: 144.9631 },
        features: ['First floor with lift access', 'Near Coburg Station', 'Professional psychology centre'],
        hours: { 'Monday': '9:00 AM - 5:00 PM', 'Tuesday': '9:00 AM - 5:00 PM', 'Wednesday': '9:00 AM - 5:00 PM', 'Thursday': '9:00 AM - 5:00 PM', 'Friday': '9:00 AM - 5:00 PM' },
        parking: 'Limited street parking available', transport: ['Train to Coburg Station', 'Tram 19'],
        phone: '(03) 9041 5031', accessibilityFeatures: ['Lift access', 'Professional centre'],
        availableServices: ['Individual counselling', 'Specialist referrals'], sortOrder: 3
      }
    ];

    defaultLocationsData.forEach(locationData => {
      const id = this.locationId++;
      const now = new Date();
      const validatedData = createLocationFromData(locationData);
      const location: PracticeLocation = {
        id,
        ...validatedData,
        createdAt: now,
        updatedAt: now,
      };
      this.practiceLocations.set(id, location);
    });
  }

  async getAllBookings(): Promise<Booking[]> { return Array.from(this.bookings.values()); }
  async getBooking(id: number): Promise<Booking | undefined> { return this.bookings.get(id); }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const createdAt = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt, status: "confirmed" };
    this.bookings.set(id, booking);
    return booking;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactId++;
    const createdAt = new Date();
    const contact: Contact = {
      id,
      firstName: insertContact.firstName,
      lastName: insertContact.lastName,
      email: insertContact.email,
      phone: insertContact.phone ?? null,
      enquiryType: insertContact.enquiryType,
      preferredLocation: insertContact.preferredLocation ?? null,
      message: insertContact.message,
      urgencyLevel: insertContact.urgencyLevel ?? 1,
      privacyConsent: insertContact.privacyConsent ?? false,
      createdAt
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> { return Array.from(this.contacts.values()); }
  async getContact(id: number): Promise<Contact | undefined> { return this.contacts.get(id); }

  async getAllPracticeLocations(): Promise<PracticeLocation[]> {
    return Array.from(this.practiceLocations.values()).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }

  async getActivePracticeLocations(): Promise<PracticeLocation[]> {
    return Array.from(this.practiceLocations.values()).filter(loc => loc.isActive === true).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }

  async getPracticeLocation(id: number): Promise<PracticeLocation | undefined> { return this.practiceLocations.get(id); }
  
  async getPracticeLocationByLocationId(locationId: string): Promise<PracticeLocation | undefined> {
    return Array.from(this.practiceLocations.values()).find(loc => loc.locationId === locationId);
  }

  async createPracticeLocation(insertLocation: InsertPracticeLocation): Promise<PracticeLocation> {
    const id = this.locationId++;
    const now = new Date();
    const validatedData = createLocationFromData(insertLocation);
    const location: PracticeLocation = {
      id,
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };
    this.practiceLocations.set(id, location);
    return location;
  }

  async updatePracticeLocation(id: number, updateData: Partial<InsertPracticeLocation>): Promise<PracticeLocation | undefined> {
    const existing = this.practiceLocations.get(id);
    if (!existing) return undefined;

    const updated: PracticeLocation = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };

    this.practiceLocations.set(id, updated);
    return updated;
  }

  async deletePracticeLocation(id: number): Promise<boolean> { return this.practiceLocations.delete(id); }

  async setPrimaryLocation(id: number): Promise<boolean> {
    const targetLocation = this.practiceLocations.get(id);
    if (!targetLocation) return false;

    this.practiceLocations.forEach((location, key) => {
      this.practiceLocations.set(key, { ...location, isPrimary: false, updatedAt: new Date() });
    });

    this.practiceLocations.set(id, { ...targetLocation, isPrimary: true, updatedAt: new Date() });

    return true;
  }

  async upsertAvailability(date: string, slots: string[]): Promise<Availability> {
    const existing = Array.from(this.availability.values()).find(a => a.date === date);
    if (existing) {
      const updated = { ...existing, availableSlots: slots, updatedAt: new Date() };
      this.availability.set(existing.id, updated);
      return updated;
    }
    const id = this.availabilityId++;
    const newAvailability: Availability = { id, date, availableSlots: slots, createdAt: new Date(), updatedAt: new Date() };
    this.availability.set(id, newAvailability);
    return newAvailability;
  }

  async getAvailabilityRange(startDate: string, endDate: string): Promise<Availability[]> {
    return Array.from(this.availability.values()).filter(a => a.date >= startDate && a.date <= endDate);
  }

  async deleteAvailability(date: string): Promise<void> {
    const existing = Array.from(this.availability.values()).find(a => a.date === date);
    if (existing) {
      this.availability.delete(existing.id);
    }
  }
  
  async saveGoogleTokens(tokens: { accessToken: string; refreshToken: string; expiryDate: number; calendarId?: string }): Promise<GoogleTokens> {
    const now = new Date();
    this.googleTokensData = {
      id: 1,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiryDate: tokens.expiryDate.toString(),
      calendarId: tokens.calendarId ?? null,
      createdAt: now,
      updatedAt: now
    };
    return this.googleTokensData;
  }
  
  async getGoogleTokens(): Promise<GoogleTokens | null> { return this.googleTokensData; }
  
  async updateGoogleTokens(tokens: { accessToken: string; expiryDate: number; calendarId?: string }): Promise<GoogleTokens | null> {
    if (!this.googleTokensData) return null;
    this.googleTokensData = {
      ...this.googleTokensData,
      accessToken: tokens.accessToken,
      expiryDate: tokens.expiryDate.toString(),
      calendarId: tokens.calendarId ?? this.googleTokensData.calendarId,
      updatedAt: new Date()
    };
    return this.googleTokensData;
  }
  
  async clearGoogleTokens(): Promise<boolean> {
    this.googleTokensData = null;
    return true;
  }
}

export const storage = new MemStorage();