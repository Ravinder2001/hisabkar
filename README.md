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

## Screens Overview

### 1. Authentication

- **Sign Up**:
  - Enter **Name, Email, and UPI Address**
  - Receive **OTP** → Verify to create an account
- **Sign In**:
  - Choose **Email OTP** or **Google Sign-In**

### 2. Home Screen

- Displays all **groups** you created or joined.
- **Create a new group**:
  - Enter **Group Name** & **Type**.
  - Get an **invitation link** to share.

### 3. Group Details

- **Group Name, Total Expense, Group Type, and Members.**
- **Options:**
  - ✅ **Settle Group** (For Owner)
  - 📥 **Download Group Data (Excel)**

### 4. Expenses

- **View all added expenses.**

#### **Add New Expense:**

- **Expense Name & Description**
- **Expense Type**
- **Amount**
- **Split Type**: **Equal, Percentage, or Custom**
- **Select Users** (Unavailable users are auto-excluded but can be added manually)
- **Submit**

#### **Expense Actions:**

- ✏️ **Edit** (Tracks previous & new amounts)
- ❌ **Delete** (Logs history)
- 📜 **View Expense Audit Logs**

### 5. Spend Analysis

- 📊 **Category-wise spending breakdown**
- View analysis **for the group** or **for a specific user**.

### 6. Notifications

- 🔔 Get alerts when someone **adds, edits, or deletes** an expense.
- Works even if the app is closed (via **Service Workers**).

### 7. Profile Section

- Update **avatar**, edit **name**, view **masked email**.
- **Availability Toggle**: Prevents others from adding you to expenses.

---

## Contributing

Feel free to contribute by creating **pull requests** or raising **issues**.

---
