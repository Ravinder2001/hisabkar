import React from "react";
import LegalLayout from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="prose max-w-none">
        <p>
          Your privacy is our priority. This policy outlines how <b>Hisabkar</b> collects, uses, and protects your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <ul className="list-disc pl-5">
          <li>
            <b>Personal Information:</b> We collect your <b>name, email, and profile picture</b> when you log in using Google authentication.
          </li>
          <li>
            <b>Transaction Data:</b> Hisabkar stores <b>expense details</b> (amount, description, and group association) for record-keeping.
          </li>
          <li>
            <b>Device Information:</b> We may collect non-personal data like browser type and device info to enhance app performance.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Data</h2>
        <p>
          Your data is used strictly for <b>expense tracking and UPI-based redirection</b>.<b>We do not sell, share, or misuse your information</b> in
          any way.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Security Measures</h2>
        <p>
          <b>We prioritize security</b>. All sensitive data, including expense details, are <b>encrypted before storage</b>. We use secure
          authentication (JWT tokens) to manage login sessions.
        </p>

        {/* <h2 className="text-xl font-semibold mt-6 mb-4">4. Third-Party Services</h2>
        <p>
          Hisabkar integrates with external <b>UPI apps</b> for payment redirection.  
          However, <b>we do not share personal or financial data</b> with these third-party services.
        </p> */}

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Open Source & Data Transparency</h2>
        <p>
          Hisabkar is an <b>open-source project</b>. If you have concerns about data usage or privacy, you are encouraged to review our code and
          contribute via our <b>GitHub repository</b>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy as needed to improve security and compliance. Any major updates will be notified to users through app
          updates or announcements.
        </p>
      </div>
    </LegalLayout>
  );
}
