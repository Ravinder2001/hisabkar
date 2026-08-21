import React from "react";
import LegalLayout from "./LegalLayout";

export default function AboutUs() {
  return (
    <LegalLayout title="About Us">
      <p>
        Welcome to <b>Hisabkar</b> — the ultimate solution for managing shared expenses effortlessly. Our goal is to make group expense tracking and
        settlements seamless, from a weekend trip to a shared flat.
      </p>

      <h2>Why Choose Hisabkar?</h2>
      <ul>
        <li>Track group expenses with flexible equal, percentage-based, or custom splits</li>
        <li>Real-time group chat, so coordination happens right next to the expenses</li>
        <li>An AI chat assistant for quick answers about your spending</li>
        <li>Smart, optimized settlement suggestions that minimize the number of payments</li>
        <li>Budget tracking to keep group spending in check</li>
        <li>Installable, offline-capable PWA — works like a native app</li>
        <li>Privacy-focused data storage with encryption</li>
        <li>Simple, mobile-first interface</li>
      </ul>

      <h2>About the Developer</h2>
      <p>
        Hi, I&apos;m <b>Ravinder Singh Negi</b>, a passionate full-stack web developer with expertise in <b>React.js, Node.js, and PostgreSQL</b>. I
        built <b>Hisabkar</b> to help users simplify their expense management using modern web technologies.
      </p>

      <h2>Connect with Me</h2>
      <ul>
        <li>
          <b>GitHub:</b>{" "}
          <a href="https://github.com/Ravinder2001" target="_blank" rel="noopener noreferrer">
            github.com/Ravinder2001
          </a>
        </li>
        <li>
          <b>LinkedIn:</b>{" "}
          <a href="https://www.linkedin.com/in/ravinder-singh-negi-3444bb1a6/" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/ravinder-singh-negi-3444bb1a6
          </a>
        </li>
        <li>
          <b>Portfolio:</b>{" "}
          <a href="https://www.ravinder.dev/" target="_blank" rel="noopener noreferrer">
            ravinder.dev
          </a>
        </li>
      </ul>

      <h2>Want to Contribute?</h2>
      <p>
        Hisabkar is constantly evolving! If you&apos;re a developer and want to contribute, check out the project on GitHub and feel free to submit
        pull requests or report issues.
      </p>
      <ul>
        <li>
          <a href="https://github.com/Ravinder2001/hisabkar" target="_blank" rel="noopener noreferrer">
            View Project Frontend on GitHub
          </a>
        </li>
        <li>
          <a href="https://github.com/Ravinder2001/hisabkar-server" target="_blank" rel="noopener noreferrer">
            View Project Backend on GitHub
          </a>
        </li>
      </ul>
    </LegalLayout>
  );
}
