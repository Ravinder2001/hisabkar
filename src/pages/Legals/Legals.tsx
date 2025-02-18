import React from "react";
import { useParams } from "react-router-dom";
import AboutUs from "./components/about";
import PrivacyPolicy from "./components/privacy";
import Disclaimer from "./components/disclaimer";
import TermsAndConditions from "./components/terms";

type PageType = "terms" | "privacy" | "disclaimer" | "about";

// Define the content for each page
const pages: Record<PageType, { title: string; Component: React.ComponentType }> = {
  terms: {
    title: "Terms & Conditions",
    Component: TermsAndConditions,
  },
  privacy: {
    title: "Privacy Policy",
    Component: PrivacyPolicy,
  },
  disclaimer: {
    title: "Disclaimer",
    Component: Disclaimer,
  },
  about: {
    title: "About Us",
    Component: AboutUs,
  },
};

const LegalPage: React.FC = () => {
  // Get the page type from URL params
  const { pageType } = useParams<{ pageType: string }>();

  // Ensure the pageType is valid, otherwise fallback to "terms"
  const validPageType = (pageType as PageType) in pages ? (pageType as PageType) : "terms";
  const { Component } = pages[validPageType];

  return (
    <div className="legal-page">
      <Component />
    </div>
  );
};

export default LegalPage;
