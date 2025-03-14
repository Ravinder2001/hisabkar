import React from "react";
export default function SiteUnavailable() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md mx-auto text-center">
        {/* SVG Illustration */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-32 h-32 md:w-40 md:h-40 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M12 6v8" />
            <path d="M12 18h.01" />
          </svg>
        </div>

        {/* Main Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Site Currently Unavailable</h1>

        <p className="text-slate-600 mb-8 text-lg">We&apos;re performing some maintenance on our servers. Please check back soon.</p>

        {/* Status Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <div className="relative">
              <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
              <div className="h-3 w-3 bg-amber-500 rounded-full absolute top-0 animate-ping opacity-75"></div>
            </div>
            <span>Our team is working on it</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="px-6 py-3 bg-gray-700 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>

        {/* Estimated Time */}
        <p className="mt-8 text-sm text-slate-500">Estimated downtime: 30 minutes</p>
      </div>

      {/* Footer */}
      <div className="mt-12 md:mt-16 text-slate-400 text-sm">
        <p>© {currentYear} Hisabkar. All rights reserved.</p>
      </div>
    </div>
  );
}
