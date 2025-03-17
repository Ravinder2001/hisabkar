import React from "react";
import LegalLayout from "./LegalLayout";

export default function AboutUs() {
  return (
    <LegalLayout title="About Us">
      <div className="prose max-w-none">
        <p>
          Welcome to <b>Hisabkar</b> – the ultimate solution for managing shared expenses effortlessly. Our goal is to make group expense tracking and
          settlements seamless.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Why Choose Hisabkar?</h2>
        <ul className="list-disc pl-5">
          <li>Track group expenses with ease</li>
          <li>Get automated settlement suggestions</li>
          <li>Privacy-focused data storage with encryption</li>
          <li>Simple and intuitive user interface</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">About the Developer</h2>
        <p>
          Hi, I&apos;m <b>Ravinder Singh Negi</b>, a passionate full-stack web developer with expertise in
          <b> React.js, Node.js, and PostgreSQL</b>. I built <b>Hisabkar</b> to help users simplify their expense management using modern web
          technologies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Connect with Me</h2>
        <ul className="list-disc pl-5">
          <li>
            <b>GitHub:</b>{" "}
            <a href="https://github.com/Ravinder2001" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              github.com/Ravinder2001
            </a>
          </li>
          <li>
            <b>LinkedIn:</b>{" "}
            <a
              href="https://www.linkedin.com/in/ravinder-singh-negi-3444bb1a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              linkedin.com/in/ravinder-singh-negi-3444bb1a6/
            </a>
          </li>
          <li>
            <b>Portfolio:</b>{" "}
            <a href="https://www.ravinder.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ravinder.dev
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">Want to Contribute?</h2>
        <p>
          Hisabkar is constantly evolving! If you&apos;re a developer and want to contribute, check out the project on GitHub and feel free to submit
          pull requests or report issues.
        </p>
        <p>
          <a href="https://github.com/Ravinder2001/hisabkar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Project Frontend on GitHub
          </a>
        </p>
        <p>
          <a
            href="https://github.com/Ravinder2001/hisabkar-server"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Project Backend on GitHub
          </a>
        </p>
      </div>
    </LegalLayout>
  );
}
