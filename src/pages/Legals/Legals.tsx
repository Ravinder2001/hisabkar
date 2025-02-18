import React, { ReactNode } from "react";
import { useParams } from "react-router-dom";
import AboutUs from "./components/about";
import PrivacyPolicy from "./components/privacy";
import Disclaimer from "./components/disclaimer";
import TermsAndConditions from "./components/terms";

type PageType = "terms" | "privacy" | "disclaimer" | "about";

// Define the content for each page
const pages: Record<PageType, { title: string; content: ReactNode }> = {
  terms: {
    title: "Terms & Conditions",
    content: <TermsAndConditions />,
  },
  privacy: {
    title: "Privacy Policy",
    content: <PrivacyPolicy />,
  },
  disclaimer: {
    title: "Disclaimer",
    content: <Disclaimer />,
  },
  about: {
    title: "About Us",
    content: <AboutUs />,
  },
};

const LegalPage = () => {
  // Get the page type from URL params
  const { pageType } = useParams<{ pageType: string }>();

  // Ensure the pageType is valid, otherwise fallback to "terms"
  const page = pages[pageType as PageType] || pages.terms;

  return page.content;
};

export default LegalPage;
