# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Dutch political membership registration application ("sw_aanmelding") for "SamenWerkt Wijk bij Duurstede" - a local political party. The application consists of:

- **Frontend**: React application with Material-UI components for a membership registration form
- **Backend**: Express server that stores form submissions in a JSON file and sends email notifications via local Postfix

## Architecture

### Frontend (React)
- Single-page application built with Create React App and React 18
- Uses Material-UI (@mui/material) for UI components with custom theming
- Modular component structure:
  - `src/App.js` - Main container with form submission logic
  - `src/components/` - Form section components (PersonalInfo, Membership, Background, Activities)
  - `src/hooks/useForm.js` - Custom hook for form state and validation
  - `src/services/api.js` - API communication layer
  - `src/utils/validation.js` - Client-side validation functions
- Form includes real-time validation with error display
- Loading states and user feedback via alerts
- Form submits to backend API at `http://localhost:3001/api/submit`

### Backend (Express)
- Node.js server in `server.js` running on port 3001
- Input validation and sanitization for all form fields
- Uses simple JSON file (`db.json`) as database with error handling
- Email notifications via Nodemailer using local Postfix (localhost:25)
- Structured error responses and logging
- Health check endpoint at `/api/health`
- Email recipient: `info@samenwerkt.nu`

## Development Commands

```bash
# Start React development server (port 3000)
npm start

# Start Express server (port 3001)
npm run server

# Build React app for production
npm run build

# Run tests
npm test
```

## Form Structure

The membership form collects:
- Personal information (name, address, birth date, phone, email)
- Membership type with fee structure (voluntary, standard €35, youth discount €20)
- Background information (education, profession, political experience)
- Activity preferences (communication, ICT, board work, campaign support, etc.)

## Design & Styling

The application features a **stunning modern design** with:

- **Brand Colors**: Red (#e53935) for PvdA and Green (#4caf50) for GroenLinks
- **SamenWerkt Logo**: Prominently displayed in gradient header
- **Glass-morphism Effects**: Backdrop blur and transparency throughout
- **Smooth Animations**: Fade-in effects, hover transforms, and loading states  
- **Material-UI Theming**: Custom Inter font, elevated shadows, rounded corners
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Visual Hierarchy**: Color-coded form sections with icons and clear typography

## Key Implementation Details

- Form state managed in single `formData` object with nested `activiteiten` object for activity checkboxes
- Real-time client-side validation with error feedback
- Membership fee conditional rendering based on radio button selection
- Server stores submissions with timestamp and sends formatted email notifications
- Modular component architecture with reusable FormSection wrapper
- CORS enabled for localhost development
- Uses Dutch language throughout the interface
- Enhanced UX with loading states, animations, and glassmorphism effects