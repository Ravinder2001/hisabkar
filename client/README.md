# Hisabkar - The Ultimate Group Expense Co-Pilot

**Hisabkar** is an industry-grade **Progressive Web Application (PWA)** that transforms complex group finances into a seamless, social experience. Built with a **High-Performance Tech Stack** (React, TypeScript, Node.js), it combines data-driven expense splitting with **Real-time Social Interaction** and **GenAI-powered Intelligence**.

### Why Hisabkar?

- **Premium Experience**: A state-of-the-art UI featuring floating card architectures, glassmorphism, and smooth micro-animations.
- **AI Financial Sensei**: An integrated **AI-powered** advisor (via OpenRouter) that provides deep analytical insights into your spending habits.
- **Zero Friction**: PWA technology means you get a native app experience directly in your browser—no app store downloads required.
- **Social by Design**: Built-in real-time chat so your group stays connected while staying on budget.

## Features

- **Google Authentication**: One-click Google Sign-In for quick access.
- **Group Expense Management**: Create and manage expense groups effortlessly.
- **Real-time Group Chat**: Discuss expenses and coordinate with your group members using the built-in real-time chat system.
- **AI Chat Assistant (OpenRouter)**: Get smart financial insights and help with your expenses via the integrated AI chatbot.
- **Budget Tracking**: Set and monitor group-specific budgets to keep your expenditures under control.
- **Flexible Expense Splitting**: Choose from **equal, percentage-based, or custom splits**.
- **Smart Settlement System**: Optimized calculations reduce unnecessary transactions.
- **Open Expenses & Advance Payments**: Standalone local group expense splitting with direct member-to-member advances, live net balances, and 1-click settlement recording.
- **Real-time Expense Overview**: View **send & receive** amounts for quick settlements.
- **Admin-Only Controls**:
  - Add or remove members
  - Modify group settings
  - Finalize and settle expenses
  - Unsettle groups if needed
- **Profile Management**:
  - Update avatar and username
  - View masked email
  - Enable/disable availability for automatic selection
- **Audit Logs**: Tracks all modifications to expenses and group activities.
- **Progressive Web App (PWA) Features**:
  - Installable on mobile and desktop
  - Offline support with service workers
- **Data Export**: Download group reports for record-keeping.
- **Support & Feedback**: Built-in bug reporting and customer support section.

## Tech Stack

- **Frontend**: React.js (TypeScript)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **State Management**: Redux Toolkit
- **API Calls**: Axios
- **UI Components**: Modular raw CSS with react-modal
- **PWA Support**: Service Workers for offline functionality
- **Security**: JWT Authentication

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Ravinder2001/hisabkar.git
   cd hisabkar
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Setup environment variables (.env):
   ```sh
   PORT=3000
   REACT_APP_GOOGLE_CLIENT_ID=
   REACT_APP_API_BASE_URL=
   DISABLE_ESLINT_PLUGIN=true
   REACT_APP_ENV=prod
   REACT_APP_VAPID_KEY=
   REACT_APP_CRYPTO_SECRET_KEY=
   REACT_APP_CRYPTO_IV=
   ```
4. Start the development server:
   ```sh
   npm run start
   ```

## Screens Overview

### 1. Home Page

- Displays all groups the user has created or joined.
- **Create New Group**:
  - Enter **Group Name** & select **Group Type**.
  - Groups can be managed dynamically.

### 2. Group Page

- **Group Overview**:
  - Displays **total members, expenditures, and settlements**.
  - Admins get extra options like **adding/removing members, settling/unsettling the group, and downloading reports**.
- **Group Chat**:
  - A dedicated tab for real-time conversation between group members.
  - Includes message history and unread message indicators.
- **Budget & AI Tools**:
  - **Budget Tracker**: Set group spending limits and track progress visually.
  - **AI Assistant**: A floating AI-powered assistant for financial analysis and group queries.
- **Expense Summary**:
  - Shows simplified transactions to minimize settlement steps.
- **Expense List**:
  - Detailed timeline of all group expenses with editable entries.

### 3. Profile Page

- Edit avatar and username (email remains masked).
- **Availability Toggle**:
  - If OFF, the user won’t be auto-selected in expenses but can still be manually added.

### 4. Open Expenses

- **Offline & Local Group Tracker**: Track group expenses without requiring an account or backend.
- **Member Advances & Direct Transfers**: Record money given in advance from any member to another with live net balance tracking.
- **Settlement Calculator & 1-Click Settle**: Greedy settlement algorithm with 1-click payment recording and WhatsApp sharing.

### 5. Support Page

- **Customer Support**: Get help directly from the app.
- **Feedback & Bug Reporting**: Submit issues and feature requests.

## Contributing

Feel free to contribute by creating **pull requests** or raising **issues**.

---

### **Hisabkar – Simplifying Expense Sharing! 🚀**
