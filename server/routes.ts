import { Router } from 'express';
import { type Express } from "express";
import { storage } from '../storage.js';
import { z } from "zod";
import { insertBookingSchema, insertContactSchema, type Contact, type PracticeLocation } from '../../shared/schema.js'; // CORRECTED PATH
import { sendBookingConfirmation, sendContactConfirmation } from '../email.js';
import { createMentalHealthAI } from '../ai/mentalHealthAI.js';
import path from "path";
import fs from "fs";
import { createServer, type Server } from 'http';

// Import both real and mock Google Calendar implementations
import * as realGoogleCalendar from "../services/googleCalendar.js";
import * as mockGoogleCalendar from "../services/mockGoogleCalendar.js";

// By default, use the real implementation
const googleCalendar = realGoogleCalendar;

// Export both implementations for use in specific routes
export const googleCalendarImplementations = {
  real: realGoogleCalendar,
  mock: mockGoogleCalendar
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ... (The rest of your file's code) ...
  // Please ensure the rest of the functions from your file are included below.
  // The only critical change is the import path on line 5.
}