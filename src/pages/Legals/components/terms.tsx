import React from "react";
import LegalLayout from "./LegalLayout";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms & Conditions">
      <div className="prose max-w-none">
        <p>
          Welcome to <b>Hisabkar</b>, a <b>Progressive Web App (PWA)</b> designed for seamless <b>group expense management</b>. By using this
          platform, you agree to the following terms:
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Account Registration & Authentication</h2>
        <p>
          To access Hisabkar, users must log in using <b>Google Authentication</b>. Upon first login, we store your{" "}
          <b>name, email, and profile picture</b> to personalize your experience. We issue a <b>JWT token</b> for managing login sessions, stored
          securely in local storage.
        </p>
        {/* 
        <h2 className="text-xl font-semibold mt-6 mb-4">2. Payments & Financial Transactions</h2>
        <p>
          <b>Hisabkar does not process or handle payments directly.</b>  
          It serves only as an <b>expense tracking and management tool</b>, redirecting users to external UPI apps for payments.
        </p> */}

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Group Expenses & User Responsibilities</h2>
        <p>
          Users can create groups, add members, and track expenses. However,{" "}
          <b>it is solely the responsibility of group members to verify, manage, and settle expenses</b>. Hisabkar is not responsible for disputes or
          incorrect transactions within groups.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Privacy & Security</h2>
        <p>
          We prioritize data security. Your information is <b>stored securely using encryption</b>. However, we are{" "}
          <b>not liable for unauthorized access due to weak personal security practices</b> (e.g., sharing login credentials).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Open Source & Community Contribution</h2>
        <p>
          Hisabkar is <b>open source</b>, and contributions are welcome! If you encounter{" "}
          <b>bugs, have feature suggestions, or want to improve the app</b>, feel free to raise an issue or submit a PR on our{" "}
          <b>GitHub repository</b>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Feedback & Updates</h2>
        <p>
          We appreciate user feedback to enhance Hisabkar. By using this platform, you agree that we may update the <b>terms and features</b> to
          improve the experience. Major changes will be communicated via updates.
        </p>
      </div>
    </LegalLayout>
  );
}
