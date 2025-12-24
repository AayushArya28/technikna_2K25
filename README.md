# Technika Website (React + Vite)

Frontend for the Technika festival website.

Built with React + Vite, with Firebase authentication/profile storage and a backend API for registrations and status checks.

## Features

- Landing + home sections (timeline, galleries, pre-event content)
- Events listing pages and registration flows:
   - Technical
   - Cultural
   - E-Sports
   - Art & Craft
   - Frame & Focus
- Delegate / Alumni flows (status + registration)
- Profile page (shows registrations and user status)
- Accommodation form/status
- Static pages: Core team, Developers, Merchandise, Contact

## Routes

Main routes configured in [src/App.jsx](src/App.jsx):

- `/` Home
- `/events` Events landing
- `/technical` Technical events
- `/cultural` Cultural events
- `/esports` E-Sports events
- `/art-craft` Art & Craft events
- `/frame-focus` Frame & Focus events
- `/timeline` Timeline page
- `/merchandise` Merchandise
- `/core` Core team
- `/devs` Developers
- `/contact` Contact
- `/login` Login
- `/profile` Profile
- `/delegate` Delegate info
- `/delegate-registration` Delegate registration (self)
- `/delegate-group-registration` Delegate registration (group)
- `/alumni` Alumni registration/status
- `/accommodation` Accommodation

## Tech Stack

- React (Vite)
- React Router
- Tailwind CSS
- Framer Motion
- Firebase (Auth + Firestore)
- Lenis (smooth scrolling)

## Local Development

Prerequisites:

- Node.js 18+ (Vite 7 requires a modern Node version)
- npm

Install and run:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Environment Variables

Firebase config is loaded from Vite environment variables in [src/firebase.js](src/firebase.js).

Create a `.env.local` in the repo root:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Notes:

- These values are Firebase "web app" config (not admin secrets), but they must match your Firebase project.
- If env vars are missing, Firebase initialization and auth-dependent flows will break.

## Backend API

The frontend calls `https://api.technika.co` (see [src/lib/api.js](src/lib/api.js)) for:

- Event registration status and submissions
- Delegate status/registration
- Alumni status/registration
- Accommodation status/submission

If you need a different backend URL for development, update `BASE_API_URL` in [src/lib/api.js](src/lib/api.js).

## Rulebooks / Static Assets

- PDFs are served from `public/rulebooks/` (e.g. technical/cultural rulebooks).
- Images and other public assets live under `public/`.

## Event IDs (Important)

Event keys and numeric IDs are defined in [src/lib/eventIds.js](src/lib/eventIds.js).

- Treat IDs as stable once published (backend expects consistent IDs).
- Add new events by introducing a new key + ID, and updating the relevant events page.

## Deployment




