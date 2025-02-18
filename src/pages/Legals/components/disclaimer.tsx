import React from "react";
import LegalLayout from "./LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer">
      <div className="prose max-w-none">
        <p>Hisabkar is a utility tool designed for expense tracking. We do not handle or process payments.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. No Financial Responsibility</h2>
        <p>We are not responsible for any payment failures, incorrect transfers, or disputes between users.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. User Responsibility</h2>
        <p>It is your responsibility to verify expense details before making payments.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. External Links</h2>
        <p>UPI payment redirection is handled by third-party apps. We do not control their operations.</p>
      </div>
    </LegalLayout>
  );
}
