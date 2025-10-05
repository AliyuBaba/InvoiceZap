# ZapInvoice - Professional Invoice Builder

## Overview

ZapInvoice is a modern, client-side invoice generation application built with React, TypeScript, and Express. The application allows users to create professional invoices with company branding, manage client information, calculate taxes and discounts, and export invoices as PDFs. All data is stored locally in the browser, ensuring privacy and eliminating the need for user accounts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Styling**: Tailwind CSS with custom CSS variables for theming, shadcn/ui components for consistent UI elements
- **Routing**: Wouter for lightweight client-side routing with minimal overhead
- **State Management**: React hooks with custom storage hooks for local and session storage persistence
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture
- **Runtime**: Node.js with Express.js serving as both API server and static file server
- **Build System**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement and middleware-based development server
- **Storage Interface**: Abstracted storage layer with in-memory implementation for user data

### Data Storage Solutions
- **Local Storage**: Company profiles and invoice templates persisted across sessions
- **Session Storage**: Draft invoices maintained during active sessions
- **Database Ready**: Drizzle ORM configured for PostgreSQL with schema definitions prepared for future database integration
- **File Handling**: Base64 encoding for logo images with client-side validation

### Client-Side Features
- **Invoice Builder**: Multi-step form with real-time calculations and preview
- **PDF Generation**: Browser-based PDF export using jsPDF and html2canvas
- **Responsive Design**: Mobile-first approach with adaptive layouts for different screen sizes
- **Data Validation**: Comprehensive validation using Zod schemas for all data structures

### Component Architecture
- **Modular Design**: Separated concerns with dedicated components for each invoice section
- **Reusable UI**: shadcn/ui component library for consistent design patterns
- **Custom Hooks**: Abstracted business logic into reusable hooks for data management
- **TypeScript Integration**: Fully typed components with shared schema definitions

### Build and Deployment
- **Development**: Integrated Vite development server with Express backend
- **Production**: Static file serving with server-side rendering fallback
- **Asset Management**: Optimized bundling with code splitting and tree shaking
- **Environment Configuration**: Flexible configuration for development and production environments

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router alternative (Wouter)
- **TypeScript**: Full TypeScript support with strict type checking
- **Build Tools**: Vite for bundling, esbuild for server compilation

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Radix UI**: Headless component primitives for accessible UI components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide Icons**: Icon library for consistent iconography
- **Font Awesome**: Additional icon set for specific UI elements

### Data Management
- **TanStack Query**: Server state management and caching (prepared for future API integration)
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration
- **date-fns**: Date manipulation and formatting utilities

### Database and ORM (Prepared)
- **Drizzle ORM**: Type-safe ORM for PostgreSQL integration
- **Neon Database**: Serverless PostgreSQL provider for cloud deployment
- **Drizzle Kit**: Database migration and schema management tools

### PDF and File Processing
- **jsPDF**: Client-side PDF generation library
- **html2canvas**: HTML to canvas conversion for PDF export
- **File API**: Browser-native file handling for image uploads

### Development and Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript Compiler**: Type checking and compilation
- **Vite Plugins**: Development tooling and optimization plugins