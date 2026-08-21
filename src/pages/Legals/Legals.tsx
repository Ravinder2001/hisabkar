import React from "react";
import { useParams } from "react-router-dom";
import AboutUs from "./components/about";
import PrivacyPolicy from "./components/privacy";
import Disclaimer from "./components/disclaimer";
import TermsAndConditions from "./components/terms";

type PageType = "terms" | "privacy" | "disclaimer" | "about";

const pages: Record<PageType, React.ComponentType> = {
  terms: TermsAndConditions,
  privacy: PrivacyPolicy,
  disclaimer: Disclaimer,
  about: AboutUs,
};

const LegalPage: React.FC = () => {
  // Get the page type from URL params
  const { pageType } = useParams<{ pageType: string }>();

  // Ensure the pageType is valid, otherwise fallback to "terms"
  const validPageType = (pageType as PageType) in pages ? (pageType as PageType) : "terms";
  const Component = pages[validPageType];

  return <Component />;
};

export default LegalPage;
