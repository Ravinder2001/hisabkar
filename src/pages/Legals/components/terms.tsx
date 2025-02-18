import React from "react";
import LegalLayout from "./LegalLayout";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms & Conditions">
      <div className="prose max-w-none">
        <p>
          Welcome to <strong>Hisabkar</strong>, your go-to expense splitting app. By using our platform, you agree to the following terms:
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Account Registration</h2>
        <p>
          To use Hisabkar, you must provide accurate details, including your <strong>name, email, and UPI address</strong>. Providing false
          information may lead to account suspension.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Payments</h2>
        <p>
          Hisabkar <strong>does not process payments directly</strong>. Instead, we facilitate expense tracking and redirect users to their UPI apps.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Group Expenses</h2>
        <p>Users can create groups and add expenses. It is the group&apos;s responsibility to verify and settle transactions.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Security</h2>
        <p>Your data is securely stored using encryption. However, we are not liable for unauthorized access due to user negligence.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Users will be notified of any major changes.</p>
      </div>
    </LegalLayout>
  );
}
