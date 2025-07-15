/**
 * Mock Google Calendar Implementation
 */

import { storage } from './storage.js'; // CORRECTED to a flat ./ path
import { addDays, format } from 'date-fns';

// Simulated calendar data
const MOCK_CALENDARS = [
  { id: 'primary', summary: 'My Primary Calendar' },
  { id: 'work', summary: 'Work Calendar' },
  { id: 'personal', summary: 'Personal Events' }
];

const REDIRECT_URI = 'https://workspace.thomarse5150.repl.co/api/google/oauth/callback';
let isConnected = false;

export function getRedirectUri() { return REDIRECT_URI; }
export function getAuthUrl(): string { return 'https://mockgoogleauth.example.com/auth'; }

export async function exchangeCodeForTokens(code: string): Promise<any> {
  await storage.saveGoogleTokens({
    accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token',
    expiryDate: Date.now() + 3600 * 1000, calendarId: 'primary'
  });
  isConnected = true;
  return {
    access_token: 'mock-access-token', refresh_token: 'mock-refresh-token',
    expiry_date: Date.now() + 3600 * 1000
  };
}

export async function connectMockGoogleCalendar(): Promise<boolean> {
  await storage.saveGoogleTokens({
    accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token',
    expiryDate: Date.now() + 3600 * 1000, calendarId: 'primary'
  });
  isConnected = true;
  return true;
}

export async function hasValidCredentials(): Promise<boolean> {
  const tokens = await storage.getGoogleTokens();
  return !!tokens && !!tokens.refreshToken;
}

export async function listCalendars() {
  if (!isConnected && !(await hasValidCredentials())) {
    return null;
  }
  return MOCK_CALENDARS;
}

export async function syncCalendarAvailability(
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  if (!isConnected && !(await hasValidCredentials())) {
    await connectMockGoogleCalendar();
  }
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const availableSlots = isWeekend ? [] : generateAvailableSlotsForDate(currentDate);
    const dateString = format(currentDate, 'yyyy-MM-dd');
    await storage.upsertAvailability(dateString, availableSlots);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return true;
}

function generateAvailableSlotsForDate(date: Date): string[] {
  const allTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  return allTimeSlots.filter(() => Math.random() > 0.3);
}

export async function listEvents(calendarId: string, startDate: Date, endDate: Date): Promise<any[] | null> { return []; }
export async function createEvent(calendarId: string, summary: string, description: string, startDateTime: Date, endDateTime: Date, attendees = []): Promise<any | null> {
  return { id: "mock-event-id", summary, description };
}
export async function getAvailableTimeSlots(calendarId: string, date: Date): Promise<string[] | null> {
  return generateAvailableSlotsForDate(date);
}
export async function disconnectGoogleCalendar(): Promise<boolean> {
  isConnected = false;
  return await storage.clearGoogleTokens();
}