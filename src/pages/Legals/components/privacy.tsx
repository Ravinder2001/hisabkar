import React from "react";
import LegalLayout from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Your privacy matters. This policy explains what <b>Hisabkar</b> collects, why, how it&apos;s used, and the choices you have.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <b>Account information:</b> your <b>name, email, and profile picture</b>, collected when you sign in with Google.
        </li>
        <li>
          <b>Expense & group data:</b> group names, members, and expense details (amount, description, who paid, and the split) that you enter.
        </li>
        <li>
          <b>Chat messages:</b> messages you send in a group&apos;s real-time chat, and any questions you send to the AI chat assistant.
        </li>
        <li>
          <b>Notification data:</b> if you enable push notifications, we store a browser-issued subscription token so we can deliver them.
        </li>
        <li>
          <b>Device & usage information:</b> non-personal data like browser type and basic performance metrics (via our monitoring provider), used to
          keep the app fast and reliable.
        </li>
      </ul>

      <h2>2. How We Use Your Data</h2>
      <p>
        Your data is used to run the core features you sign up for: tracking and splitting expenses, calculating settlements, delivering group chat
        and notifications, generating AI-assisted spending insights, and letting you export your own group&apos;s data.{" "}
        <b>We do not sell your information</b>, and we don&apos;t share it with third parties beyond what&apos;s needed to run the service (see
        below).
      </p>

      <h2>3. Third-Party Services</h2>
      <ul>
        <li>
          <b>Google Sign-In:</b> used for authentication. Google&apos;s own privacy policy governs how they handle your Google account data.
        </li>
        <li>
          <b>OpenRouter (AI provider):</b> messages you send to the AI chat assistant are sent to this third-party service to generate a response.
        </li>
        <li>
          <b>Monitoring (New Relic):</b> used to detect errors and performance issues so we can keep the app reliable; this does not include your
          expense content.
        </li>
      </ul>
      <p>
        We don&apos;t share your financial or personal data with any of the above beyond what&apos;s strictly required for that service to function.
      </p>

      <h2>4. Cookies & Local Storage</h2>
      <p>
        Hisabkar uses your browser&apos;s local storage to keep you signed in (storing your session token) and to remember app preferences. Clearing
        your browser&apos;s site data will sign you out.
      </p>

      <h2>5. Security Measures</h2>
      <p>
        <b>We prioritize security.</b> Sensitive data, including expense details, is <b>encrypted before storage</b>, and we use secure, token-based
        authentication to manage login sessions.
      </p>

      <h2>6. Data Retention & Deletion</h2>
      <p>
        We retain your account and group data for as long as your account is active, so your expense history stays available to you. If you&apos;d
        like your account and associated data deleted, contact us via the <a href="/support">Support</a> page and we&apos;ll process the request.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>Hisabkar is not directed at children under 13, and we do not knowingly collect personal information from them.</p>

      <h2>8. Open Source & Data Transparency</h2>
      <p>
        Hisabkar is an <b>open-source project</b>. If you have concerns about how data is handled, you&apos;re welcome to review the source code and
        raise questions via our GitHub repository, linked on the <a href="/legal/about">About Us</a> page.
      </p>

      <h2>9. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy as the app changes, to keep it accurate and to improve clarity. Material changes will be reflected here and,
        where relevant, noted on the app&apos;s <a href="/whats-new">What&apos;s New</a> page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy or your data? Reach out anytime through the <a href="/support">Support</a> page.
      </p>
    </LegalLayout>
  );
}
