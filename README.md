# Technika 2K26 - Official Website

![Technika Logo](./technika_logo.png)

Welcome to the official repository for **Technika 2K26**, the annual techno-cultural festival of Birla Institute of Technology, Patna. This modern web application serves as the digital gateway to the festival, handling everything from event showcases to user registrations.

## 🚀 Overview

The Technika 2K26 website is a high-performance, interactive platform built to provide a seamless experience for thousands of participants. It features immersive animations, a robust registration system for various user types (Delegates, Alumni, BIT Students), and real-time status tracking.

## ✨ Key Features

### 🎭 Event Management
-   **Categorized Showcases**: Dedicated sections for **Technical**, **Cultural**, **Esports**, **Art & Craft**, and **Frame & Focus** events.
-   **Detailed Event Pages**: Each event (e.g., *Hackathon*, *Robo War*, *Solo Saga*) has its own space with rules, problem statements, and registration links.
-   **Dynamic Rulebooks**: Integrated PDF viewers for event rulebooks.

### 🔐 User Roles & Registration
-   **Delegates**: 
    -   **Solo Registration**: Individual pass generation.
    -   **Group Registration**: Team creation and management flow.
-   **Alumni Portal**: Verification and registration for college alumni.
-   **BIT Students**: Seamless internal registration flow.
-   **Profile Dashboard**: A central hub for users to view:
    -   Technika ID (T-ID) and QR Code.
    -   Registered Events status.
    -   Payment status verification.

### 🏠 Logistics
-   **Accommodation System**: Integrated form and status tracking for out-of-station participants requesting stay.
    -   **Eligibility**: Available for Alumni and non-BIT student Delegates.
    -   **Pricing**: INR 1,499 (includes 3 nights stay + meals).
    -   **Coverage**: Breakfast, Lunch, Snacks, Dinner, and basic amenities.

### 🎨 UI/UX Excellence
-   **Immersive Animations**: Powered by **GSAP** and **Framer Motion** for a premium feel.
-   **Smooth Navigation**: Leveraging **Lenis** for silky smooth scrolling experiences.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop via **Tailwind CSS**.

## 🛠️ Technology Stack

This project harnesses the latest web technologies for speed and scalability:

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | v19 | Component-based UI architecture. |
| **Build Tool** | **Vite** | v7 | Lightning-fast development and building. |
| **Styling** | **Tailwind CSS** | v4 | Utility-first CSS for rapid design. |
| **Language** | **JavaScript** | ESModules | Core logic implementation. |
| **Backend / BaaS** | **Firebase** | v12 | Authentication, Firestore Database. |
| **Animations** | **GSAP** | v3 | Complex, high-performance animations. |
| **Micro-interactions** | **Framer Motion** | v12 | React-native feeling gestures and layout transitions. |
| **Scrolling** | **Lenis** | v1 | Smooth scrolling normalization. |
| **3D / Canvas** | **OGL** | v1 | Lightweight WebGL for creative visuals. |

## 📂 Project Structure

```bash
src/
├── components/       # Reusable UI components (Nav, Footer, ChromaGrid, etc.)
├── context/          # Global state (Auth, Popup, Entitlements, Transition)
├── events/           # Specific event landing pages (Technical.jsx, Cultural.jsx...)
├── fonts/            # Custom typefaces
├── hooks/            # Custom React hooks
├── lib/              # Utilities, API helpers, and Constants (eventIds.js)
├── pages/            # Main route pages (Home, Profile, Login, Core, etc.)
├── App.jsx           # Main Application Routing
├── firebase.js       # Firebase initialization and config
├── index.css         # Global styles and Tailwind directives
└── main.jsx          # Application entry point
```

## 🔌 Setup & Local Development

### Prerequisites
-   **Node.js** (v18 or higher recommended for Vite 7)
-   **npm**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AayushArya28/technikna_2K25.git
    cd technikna_2K25
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```
    > **Note:** Without these keys, Authentication and Database features will not work.

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## 🗺️ Application Routes

| Path | Description |
| :--- | :--- |
| `/` | Landing / Home Page |
| `/events` | Events Hub (Navigates to categories) |
| `/technical` | Technical Events List |
| `/cultural` | Cultural Events List |
| `/esports` | Gaming & Esports Tournaments |
| `/login` | User Authentication |
| `/profile` | User Dashboard (Status, QR, Events) |
| `/delegate-registration` | Solo Delegate Registration |
| `/delegate-group-registration`| Group Delegate Registration |
| `/alumni` | Alumni Registration & Status |
| `/core` | Core Team Members |
| `/devs` | Developer Credits |

---

<p align="center">
  Built with ❤️ by the Technika 2K26 Technical Team
</p>
