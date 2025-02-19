# Hisabkar - Expense Splitting Frontend

Hisabkar is a **PWA-based React web app** that helps users split expenses efficiently within groups.

## Features

- **User Authentication**: OTP-based login & Google Sign-In.
- **Group Expense Management**: Create groups, invite members, and track expenses.
- **Flexible Expense Splitting**: Choose from **equal, percentage-based, or custom splits**.
- **Real-time Expense Overview**: View **send** & **receive** amounts for easy settlements.
- **Audit Logs**: Track all modifications to expenses and group activities.
- **Interactive Analytics**: Expense breakdown using **charts**.
- **User Availability Toggle**: Exclude unavailable users when adding expenses.
- **Progressive Web App (PWA)**: Works offline & sends push notifications.
- **Data Export**: Download group reports in Excel format.
- **Profile Management**: Update name, avatar, and view masked email.

## Tech Stack

- **Frontend**: React.js (TypeScript)
- **State Management**: Redux Toolkit
- **API Calls**: Axios
- **UI Components**: shadcn/ui
- **PWA Support**: Service Workers for notifications
- **Security**: AES Encryption for sensitive data

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/hisabkar-client.git
   cd hisabkar-client
   ```

2. Install dependencies
   ```sh
   npm install
   ```
3. Setup .env

   ```sh

   PORT=3000
   REACT_APP_GOOGLE_CLIENT_ID=
   REACT_APP_API_BASE_URL=
   DISABLE_ESLINT_PLUGIN=true
   REACT_APP_VAPID_KEY=
   REACT_APP_ENV=prod

   # Crypto Encryption
   REACT_APP_CRYPTO_SECRET_KEY=
   REACT_APP_CRYPTO_IV=

   ```

4. Start the server
   ```sh
   npm run start
   ```
