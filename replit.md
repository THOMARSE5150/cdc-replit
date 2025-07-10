# Celia Dunsmore Counselling Website

## Overview

This is a full-stack web application for Celia Dunsmore's professional counselling practice. The system provides a modern, responsive platform for clients to learn about services, book appointments, and contact the counsellor directly. The application prioritises accessibility, user experience, and privacy compliance for healthcare services.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

**Frontend**: React 18 SPA with TypeScript
- React components for UI rendering
- Tailwind CSS for responsive styling
- shadcn/ui component library for consistent design
- Vite for build tooling and development server
- Client-side routing for navigation

**Backend**: Express.js API server
- RESTful API endpoints for data operations
- TypeScript for type safety
- Server-side business logic and validation
- Email service integration

**Database**: PostgreSQL with Drizzle ORM
- Structured data storage for bookings and contacts
- Type-safe database operations
- Schema-driven development approach

**Build System**: Vite with esbuild
- Fast development builds
- Optimised production bundles
- Hot module replacement for development

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components organised by feature
- **State Management**: React hooks and Tanstack React Query for server state
- **Styling**: Tailwind CSS with design system approach
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Client-side navigation system
- **Performance**: Lazy loading and code splitting

### Backend Architecture
- **API Layer**: Express.js routes handling HTTP requests
- **Database Layer**: Drizzle ORM for PostgreSQL interactions
- **Authentication**: Google OAuth2 integration for calendar access
- **Email Service**: SendGrid integration for notifications
- **Error Handling**: Centralised error management

### Data Models
- **Bookings**: Client appointment scheduling data
- **Contact Forms**: Client inquiry management
- **User Sessions**: Authentication state management

## Data Flow

1. **Client Requests**: Browser sends requests to React application
2. **Frontend Processing**: React components handle user interactions
3. **API Communication**: Frontend makes HTTP requests to Express backend
4. **Database Operations**: Backend queries PostgreSQL via Drizzle ORM
5. **External Services**: Integration with Google Calendar and SendGrid
6. **Response Handling**: Data flows back through the stack to update UI

The application supports both static deployment (for hosting platforms) and full-stack deployment (for complete functionality).

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Express.js, Node.js runtime
- **Database**: PostgreSQL, Drizzle ORM
- **Build Tools**: Vite, esbuild, TypeScript

### Third-Party Services
- **Google Calendar API**: Appointment scheduling integration
- **SendGrid**: Email notification service
- **Google Maps API**: Location services for practice locations

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimisation

## Deployment Strategy

The application supports multiple deployment approaches:

**Static Deployment**:
- Frontend-only deployment to static hosting platforms
- Contact forms use direct email integration
- Reduced functionality but easier deployment

**Full-Stack Deployment**:
- Complete application with backend API
- Full booking system functionality
- Database-backed data persistence

**Replit Deployment**:
- Integrated development and hosting environment
- Automatic deployment on code changes
- Built-in database provisioning

The build process generates optimised static assets and server bundles for production deployment.

## Changelog

- July 01, 2025. Initial setup
- July 01, 2025. SEO audit and optimization completed:
  - Updated sitemap.xml with all current pages and proper URLs
  - Created robots.txt file for search engine crawlers
  - Optimized SEO meta configuration for key pages
  - Updated structured data with accurate business information
  - Created Google My Business profile preparation file

## User Preferences

Preferred communication style: Simple, everyday language.