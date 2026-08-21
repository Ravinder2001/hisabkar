import React from "react";
import LegalLayout from "./LegalLayout";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>
        Welcome to <b>Hisabkar</b>, a <b>Progressive Web App (PWA)</b> for seamless group expense management, real-time group chat, and AI-assisted
        spending insights. By creating an account or using the app, you agree to the terms below.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be able to form a legally binding agreement to use Hisabkar. If you&apos;re using the app on behalf of a friend group, household, or
        trip party, you&apos;re responsible for making sure the other members are aware of and comfortable with how their information is used, as
        described below.
      </p>

      <h2>2. Account Registration & Authentication</h2>
      <p>
        To access Hisabkar, users must log in using <b>Google Authentication</b>. Upon first login, we store your{" "}
        <b>name, email, and profile picture</b> to personalize your experience. We issue a <b>JWT token</b> for managing login sessions, stored
        securely in local storage on your device.
      </p>

      <h2>3. Group Expenses & User Responsibilities</h2>
      <p>
        Users can create groups, add members, and track expenses, with support for equal, percentage-based, or custom splits. However,{" "}
        <b>it is solely the responsibility of group members to verify, manage, and settle expenses</b> —{" "}
        <b>Hisabkar does not process payments or move money</b>; it only calculates who owes whom and lets you share that summary (including over
        WhatsApp). Hisabkar is not responsible for disputes, incorrect entries, or unsettled balances between group members.
      </p>

      <h2>4. Group Chat & AI Assistant</h2>
      <p>
        Groups include a real-time chat for coordinating expenses, and an optional <b>AI chat assistant</b> (powered by a third-party AI provider,
        OpenRouter) that can answer questions about your spending. Messages you send to the AI assistant are transmitted to that third-party provider
        for processing. <b>AI responses are for general informational purposes only</b> and should not be relied on as financial, tax, or legal
        advice. Please keep chat messages respectful — abusive, illegal, or harassing use of group chat is not permitted.
      </p>

      <h2>5. Notifications</h2>
      <p>
        With your permission, Hisabkar can send <b>push notifications</b> for new expenses, settlements, and reminders. You can enable or disable
        these at any time from your Profile page.
      </p>

      <h2>6. Data Privacy & Security</h2>
      <p>
        We prioritize data security. Your information is <b>stored securely and sensitive data is encrypted</b>. See our{" "}
        <a href="/legal/privacy">Privacy Policy</a> for full details on what we collect and how it&apos;s used. We are{" "}
        <b>not liable for unauthorized access resulting from weak personal security practices</b> (for example, sharing your login or leaving a device
        unlocked).
      </p>

      <h2>7. Acceptable Use</h2>
      <p>
        You agree not to use Hisabkar to violate any law, to harass or harm another user, to attempt to gain unauthorized access to the app or other
        users&apos; data, or to disrupt the service (for example, through automated abuse of the API). We may suspend or terminate access for accounts
        that violate these terms.
      </p>

      <h2>8. Service Availability</h2>
      <p>
        Hisabkar is an actively developed, open-source project. We aim for high uptime, but <b>we don&apos;t guarantee uninterrupted availability</b>{" "}
        — features, APIs, or the service as a whole may occasionally be unavailable for maintenance or due to factors outside our control.
      </p>

      <h2>9. Open Source & Community Contribution</h2>
      <p>
        Hisabkar is <b>open source</b>, and contributions are welcome. If you encounter{" "}
        <b>bugs, have feature suggestions, or want to improve the app</b>, feel free to raise an issue or submit a pull request on our GitHub
        repository (linked on the <a href="/legal/about">About Us</a> page), or reach out via the <a href="/support">Support</a> page.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these terms as the app evolves, to reflect new features or improve clarity. Material changes will be reflected here and
        summarized on the app&apos;s <a href="/whats-new">What&apos;s New</a> page. Continued use of Hisabkar after an update means you accept the
        revised terms.
      </p>
    </LegalLayout>
  );
}
