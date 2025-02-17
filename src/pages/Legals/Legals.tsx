import React from "react";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";

// Define the structure of a page
interface Page {
  title: string;
  content: React.ReactNode;
}

// Define valid page types
type PageType = "terms" | "privacy" | "disclaimer" | "about";

const LegalPage = () => {
  // Type the params properly
  const { pageType } = useParams<{ pageType: PageType }>();

  const pages: Record<PageType, Page> = {
    terms: {
      title: "Terms & Conditions",
      content: (
        <>
          <p>
            Welcome to <strong>Hisabkar</strong>, your go-to expense splitting app. By using our platform, you agree to the following terms:
          </p>

          <h2>1. Account Registration</h2>
          <p>
            To use Hisabkar, you must provide accurate details, including your <strong>name, email, and UPI address</strong>. Providing false
            information may lead to account suspension.
          </p>

          <h2>2. Payments</h2>
          <p>
            Hisabkar <strong>does not process payments directly</strong>. Instead, we facilitate expense tracking and redirect users to their UPI
            apps.
          </p>

          <h2>3. Group Expenses</h2>
          <p>Users can create groups and add expenses. It is the group&apos;s responsibility to verify and settle transactions.</p>

          <h2>4. Security</h2>
          <p>Your data is securely stored using encryption. However, we are not liable for unauthorized access due to user negligence.</p>

          <h2>5. Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Users will be notified of any major changes.</p>
        </>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <>
          <p>
            Your privacy is our priority. This policy outlines how <strong>Hisabkar</strong> collects, uses, and protects your information.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email, and UPI address for registration.
            </li>
            <li>
              <strong>Transaction Data:</strong> Expense details within groups.
            </li>
          </ul>

          <h2>2. How We Use Data</h2>
          <p>We use your information solely to facilitate **expense tracking and UPI-based redirection**. We do not share or sell your data.</p>

          <h2>3. Security Measures</h2>
          <p>
            All sensitive data, including UPI addresses, are <strong>encrypted</strong> before storage in our database.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>Hisabkar integrates with external UPI apps but does not share personal data with them.</p>
        </>
      ),
    },
    disclaimer: {
      title: "Disclaimer",
      content: (
        <>
          <p>Hisabkar is a utility tool designed for expense tracking. We do not handle or process payments.</p>

          <h2>1. No Financial Responsibility</h2>
          <p>We are not responsible for any payment failures, incorrect transfers, or disputes between users.</p>

          <h2>2. User Responsibility</h2>
          <p>It is your responsibility to verify expense details before making payments.</p>

          <h2>3. External Links</h2>
          <p>UPI payment redirection is handled by third-party apps. We do not control their operations.</p>
        </>
      ),
    },
    about: {
      title: "About Us",
      content: (
        <>
          <p>
            Welcome to <strong>Hisabkar</strong> – the ultimate solution for managing shared expenses effortlessly. Our goal is to make group expense
            tracking and settlements seamless via UPI integration.
          </p>

          <h2>Why Choose Hisabkar?</h2>
          <ul>
            <li>Track group expenses easily</li>
            <li>Automated settlement suggestions</li>
            <li>Secure payment redirection via UPI apps</li>
            <li>Privacy-focused data storage with encryption</li>
          </ul>

          <h2>About the Developer</h2>
          <p>
            Hi, I&apos;m <strong>Ravinder Singh Negi</strong>, a passionate full-stack web developer with expertise in
            <strong> React.js, Node.js, and PostgreSQL</strong>. I built **Hisabkar** to help users simplify their expense management with modern web
            technologies.
          </p>

          <h2>Connect with Me</h2>
          <ul>
            <li>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/Ravinder2001" target="_blank" rel="noopener noreferrer">
                https://github.com/Ravinder2001
              </a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a href="https://www.linkedin.com/in/ravinder-singh-negi-3444bb1a6/" target="_blank" rel="noopener noreferrer">
                https://www.linkedin.com/in/ravinder-singh-negi-3444bb1a6/
              </a>
            </li>
            <li>
              <strong>Portfolio:</strong>{" "}
              <a href="https://www.ravinder.dev/" target="_blank" rel="noopener noreferrer">
                https://www.ravinder.dev/
              </a>
            </li>
          </ul>

          <h2>Want to Contribute?</h2>
          <p>
            Hisabkar is constantly evolving! If you&apos;re a developer and want to contribute, check out the project on GitHub and feel free to
            submit pull requests or report issues.
          </p>
          <p>
            <a href="https://github.com/Ravinder2001/hisabkar" target="_blank" rel="noopener noreferrer">
              View Project Frontend on GitHub
            </a>
          </p>
          <p>
            <a href="https://github.com/Ravinder2001/hisabkar-server" target="_blank" rel="noopener noreferrer">
              View Project Backend on GitHub
            </a>
          </p>
        </>
      ),
    },
  };

  // Safely access the page with proper fallback
  const page = (pageType && pages[pageType as PageType]) || pages.terms;

  return (
    <div className={styles.container}>
      <div className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Hisabkar<span className="text-black">.</span>
      </div>
      <h1>{page.title}</h1>
      {page.content}
    </div>
  );
};

export default LegalPage;
