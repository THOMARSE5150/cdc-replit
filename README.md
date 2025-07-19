# Celia Dunsmore Counselling Website

This is a full-stack web application for Celia Dunsmore's counseling service. The application enables clients to view services, book appointments, and contact the counselor directly.

## Features

- Modern responsive UI built with React and Tailwind CSS
- Online booking system with Google Calendar integration
- Contact form for client inquiries
- Admin dashboard for managing bookings and availability
- Email notifications for booking confirmations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **API Integrations**: Google Calendar, SendGrid
- **Build Tools**: Vite, esbuild

## Getting Started on Replit

1. **Environment Variables**: Make sure to set these in your Replit secrets:
   - `DATABASE_URL` : PostgreSQL connection string
   - `GOOGLE_CLIENT_ID` : For Google Calendar integration
   - `GOOGLE_CLIENT_SECRET` : For Google Calendar integration
   - `SENDGRID_API_KEY` : For email notifications

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Database Setup**:
   ```
   npm run db:push
   ```

4. **Development Mode**:
   ```
   npm run dev
   ```

5. **Production Build**:
   ```
   npm run build
   npm run start
   ```

## Project Structure

- `client/` : Frontend React application
- `server/` : Express.js backend
- `shared/` : Shared types and schemas used by both frontend and backend
- `migrations/` : Database migration scripts

## Deployment

This project is configured for easy deployment on Replit:

- The workflow is configured to run the application
- The project uses Replit's PostgreSQL database
- Deployments can be initiated directly from Replit

## License

MIT
