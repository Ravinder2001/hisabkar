import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
}

export default function LegalLayout({ children, title }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <nav className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-4 text-sm text-gray-600">
          <li>
            <Link to="/legal/terms" className="hover:text-gray-900">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link to="/legal/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/legal/disclaimer" className="hover:text-gray-900">
              Disclaimer
            </Link>
          </li>
          <li>
            <Link to="/legal/about" className="hover:text-gray-900">
              About Us
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
