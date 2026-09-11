# 🎟️ TicketPass — Digital Event Ticketing & Checkpoint Management Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, full-stack responsive web application for end-to-end event ticketing. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Motion**, **TicketPass** delivers an intuitive self-service booking storefront for attendees, high-speed camera QR pass validation for checkpoint staff, walk-in box office assisted sales, and an administrative console for publishing events and tracking capacity analytics.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
  - [1. Attendee Storefront & Passes](#1-attendee-storefront--passes)
  - [2. Staff Checkpoint & QR Scanner](#2-staff-checkpoint--qr-scanner)
  - [3. Box Office Assisted Purchases](#3-box-office-assisted-purchases)
  - [4. Admin & Senior Staff Console](#4-admin--senior-staff-console)
- [Pre-configured Demo Accounts](#-pre-configured-demo-accounts)
- [How to Clone & Run](#-how-to-clone--run)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
  - [Available Scripts](#available-scripts)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Tech Stack](#-tech-stack)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview

TicketPass bridges the gap between digital ticket purchasing and physical gate operations:
- **Zero App Installation**: Fully web-based; attendees can browse, buy, and present digital passbook tickets directly from mobile or desktop browsers.
- **Real-Time QR Validation**: On-site entrance staff scan passes directly using their device camera with sub-second admittance checks and duplicate pass alerts.
- **Independent Role Scopes**: Role-based routing isolates attendee access from staff scanners and administrator controls.
- **Guest Browsing & Automatic Checkout Resume**: Visitors can explore the catalog without an account. When choosing to book, they are prompted to sign in and immediately returned to their selected ticket checkout.

---

## 🚀 Core Features

### 1. Attendee Storefront & Passes
- **Live Event Catalog**: Explore events across dynamic categories (Music, Tech & Innovation, Sports, Culture & Arts, Food & Festivals, Cinema).
- **Featured Hero Showcase**: Highlight banner displaying headline events with quick direct access.
- **Real-Time Search & Filtering**: Instant search by event name, venue, organizer, or category tags.
- **Event Information Modal**: View comprehensive event details, venue maps/addresses (Phnom Penh landmarks like Diamond Island, Sokha Hotel, Olympic Stadium, Furi Mall), organizer bios, rules, and multi-tier pricing.
- **Multi-Tier Checkout Flow**:
  - Select ticket tiers (VIP, Early Bird, General Admission).
  - Quantity controls with live pricing calculations.
  - Mock payment simulation with celebratory confetti feedback.
- **Apple Wallet-Style Passbook (`My Passes`)**:
  - Clean card passes displaying unique ticket numbers, event dates, venues, seating tiers, and secure QR codes.
  - Modal view with high-contrast scannable QR display and print-friendly layouts.

### 2. Staff Checkpoint & QR Scanner
- **Live Camera Scanner**: Integrated in-browser camera scanning powered by `jsQR`.
- **Instant Gate Admittance Verification**:
  - 🟢 **VALID PASS**: Grants admission, displays attendee name, tier, and timestamps the check-in.
  - 🟡 **ALREADY CHECKED IN**: Flags passes that have already been used, showing previous check-in time to prevent duplicate entry.
  - 🔴 **INVALID CODE**: Alerts staff to unrecognized tokens or cancelled passes.
- **Manual Input & Simulation Deck**: Allows manual pass number entry or quick one-click testing of pre-configured valid, used, and cancelled passes.
- **Live Check-In Audit Logs**: Real-time session history of all scanned passes, statuses, and staff operator stamps.

### 3. Box Office Assisted Purchases
- Designed for on-site gate staff to sell tickets directly to walk-in attendees.
- Real-time event inventory deduction, attendee name capture, and instant issuance of verified digital passes.

### 4. Admin & Senior Staff Console
- **Event Publishing & Management**:
  - Create new events with name, category, date, schedule, organizer, and venue rules.
  - Multi-tier ticket configuration (VIP, Regular, Balcony) with custom capacities and pricing.
  - Direct local photo upload (via Base64 reader with file preview) or external image URLs.
- **Real-Time Analytics Dashboard**:
  - Gross sales metrics and ticket volume breakdown.
  - Capacity fulfillment percentages and sold-out notifications.
  - System activity and audit timeline.
- **Hero Banner & Category Customization**:
  - Edit the storefront hero spotlight event.
  - Create, reorder, and activate custom event categories.

---

## 👥 Pre-configured Demo Accounts

The platform includes four pre-seeded Cambodian demo profiles for testing without typing passwords:

| Persona | Role | Email | Security Scope |
| :--- | :--- | :--- | :--- |
| **Chan Dara** | Customer | `chandara@gmail.com` | Browse catalog, book multi-pass orders, digital passbook |
| **Bopha Chea** | Staff Scanner | `bophachea@gmail.com` | Live camera QR scanner, entrance check-in audit logs |
| **Vireak Roth** | Senior Staff | `vireakroth@gmail.com` | QR scanner, assisted walk-in sales, storefront event creation |
| **Kosal Seng** | Admin | `kosalseng@gmail.com` | Full master console, system audit, category management |

> **Tip:** On the Sign In page, click any of the **Interactive Demo Personas** on the right side to log in instantly.

---

## 💻 How to Clone & Run

### Prerequisites
Make sure you have installed on your computer:
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended)
- **Git**

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YimAyuVadna/Online-Ticket-.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd Online-Ticket-
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server at `http://localhost:3000` with instant HMR |
| `npm run build` | Compiles TypeScript and builds production assets into `dist/` |
| `npm run preview` | Locally serves the optimized production build from `dist/` |
| `npm run lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`) |

---

## 📂 Architecture & Directory Structure

```
Online-Ticket-/
├── public/                 # Static public assets
├── src/
│   ├── components/
│   │   ├── admin/          # Admin console, event creator, category & hero managers
│   │   ├── auth/           # Sign In, Sign Up, and one-click Demo Persona cards
│   │   ├── common/         # Reusable QR generator, modal wrappers, buttons
│   │   ├── customer/       # Event catalog, hero showcase, event details & checkout
│   │   ├── layout/         # Responsive navigation bar with spring active pills
│   │   ├── profile/        # User profile and account preferences modal
│   │   ├── scanner/        # Camera QR code reader with jsQR and entrance audit logs
│   │   ├── staff/          # Staff checkpoint dashboard and assisted box office sales
│   │   └── tickets/        # Apple Wallet-style pass cards and ticket detail views
│   ├── context/
│   │   └── TicketContext.tsx  # Centralized React state management (Auth, Events, Passes)
│   ├── data/
│   │   └── initialData.ts  # Pre-seeded events, categories, and test user personas
│   ├── App.tsx             # Root application orchestrator and modal coordination
│   ├── index.css           # Tailwind CSS v4 styling & scrollbar stability rules
│   ├── main.tsx            # React application DOM entrypoint
│   └── types.ts            # TypeScript interfaces, roles, and data models
├── index.html              # HTML document root with Plus Jakarta Sans & JetBrains Mono
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # Strict TypeScript configuration
└── vite.config.ts          # Vite build and plugin configurations
```

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation Physics**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Code Generation**: [qrcode](https://github.com/soldair/node-qrcode)
- **Live Camera QR Decoding**: [jsQR](https://github.com/cozmo/jsQR)
- **Celebration Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for educational or commercial purposes.