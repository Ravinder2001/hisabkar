import React from "react";
import LegalLayout from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="prose max-w-none">
        <p>
          Your privacy is our priority. This policy outlines how <strong>Hisabkar</strong> collects, uses, and protects your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Personal Information:</strong> Name, email, and UPI address for registration.
          </li>
          <li>
            <strong>Transaction Data:</strong> Expense details within groups.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Data</h2>
        <p>
          We use your information solely to facilitate <strong>expense tracking and UPI-based redirection</strong>. We do not share or sell your data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Security Measures</h2>
        <p>
          All sensitive data, including UPI addresses, are <strong>encrypted</strong> before storage in our database.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Third-Party Services</h2>
        <p>Hisabkar integrates with external UPI apps but does not share personal data with them.</p>
      </div>
    </LegalLayout>
  );
}
