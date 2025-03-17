import React from "react";
import LegalLayout from "./LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer">
      <div className="prose max-w-none">
        <p>
          <b>Hisabkar</b> is an <b>expense tracking</b> tool designed to help users manage and split expenses. We do <b>not process</b> payments,
          store financial credentials, or facilitate fund transfers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. No Financial Responsibility</h2>
        <p>
          Hisabkar is a tool for recording shared expenses. We are <b>not responsible</b> for any financial disputes, incorrect calculations, or
          settlement issues among users.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. User Responsibility</h2>
        <p>
          Users are <b>fully responsible</b> for verifying and settling their own expenses. Hisabkar does not validate, enforce, or mediate any
          transactions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Privacy & Security</h2>
        <p>
          We prioritize <b>user privacy</b> and secure all stored expense data. However, users should ensure they do not share sensitive financial
          details within the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Open Source & No Warranty</h2>
        <p>
          Hisabkar is an <b>open-source project</b> developed for the community. The software is provided <b>&quot;as is&quot;</b>, with no guarantees
          regarding accuracy, availability, or security.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Changes to Disclaimer</h2>
        <p>
          We reserve the right to <b>update this disclaimer</b> as necessary. Major updates will be communicated through project releases or community
          announcements.
        </p>
      </div>
    </LegalLayout>
  );
}
