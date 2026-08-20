/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

import showToast from "../../utils/helpers/toastHelper";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import Messages from "../../utils/constant/Messages";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";
import CustomCircularLoading from "../../components/Atoms/CustomCircularLoading/CustomCircularLoading";
import versionHistory from "../../data/versionHistory.json";
import styles from "./style.module.css";

const VersionTag = () => (
  <Link to={CONSTANTS.PROJECT_ROUTES.WHATS_NEW} className={styles.versionTag}>
    v{versionHistory.currentVersion} · What&apos;s new
  </Link>
);

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.9 2.5 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.1 17.6 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z" />
    <path fill="#FBBC05" d="M10.4 19.3c-.5 1.5-.8 3.1-.8 4.7s.3 3.2.8 4.7l-7.8 6.1C1 31.6 0 27.9 0 24s1-7.6 2.6-10.8z" />
    <path
      fill="#34A853"
      d="M24 48c6.4 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2.1 1.4-4.9 2.3-8.6 2.3-6.4 0-11.7-3.6-13.6-8.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
    />
  </svg>
);

const FootLinks = () => (
  <div className={styles.footLinks}>
    <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/terms`}>Terms</Link>
    <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/privacy`}>Privacy Policy</Link>
    <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/disclaimer`}>Disclaimer</Link>
    <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/about`}>About Us</Link>
    <Link to={CONSTANTS.PROJECT_ROUTES.SUPPORT}>Support</Link>
  </div>
);

function SignIn() {
  const dispatch = useDispatch();

  const { fetchData: postGoogleSignIn, response: googleSignInRes, isLoading: googleLoading } = useApiFetch("");

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await postGoogleSignIn(CONSTANTS.API_ROUTES.GOOGLE_SIGN_IN, {
        method: "POST",
        data: { token: tokenResponse.access_token },
      });
    },
    onError: () => {
      showToast(Messages.GENERAL.SERVER_ERROR, "error");
    },
  });

  const handleLogin = (values: any) => {
    const decode: any = decodeJWT(values.data.token);
    if (typeof decode === "object" && decode !== null) {
      dispatch(setUserLoggedIn({ ...decode, token: values.data.token }));
      showToast(Messages.LOGS.WELCOME(decode.name), "success");
    }
  };

  useEffect(() => {
    if (googleSignInRes?.success === 1) {
      handleLogin(googleSignInRes);
    }
  }, [googleSignInRes]);

  const GoogleButton = () => (
    <button className={styles.googleBtn} onClick={() => !googleLoading && handleGoogleSignIn()} disabled={googleLoading}>
      <GoogleMark />
      <span>{googleLoading ? <CustomCircularLoading /> : "Continue with Google"}</span>
    </button>
  );

  return (
    <div className={styles.page}>
      {/* ── Mobile / narrow layout ─────────────────────────────────────── */}
      <div className={styles.mobile}>
        <div className={styles.top}>
          <div className={styles.mark}>₹</div>
          <div className={styles.wordmark}>hisabkar</div>
          <p className={styles.tagline}>Split expenses with friends &amp; family. Settle up without the awkward math.</p>
          <div className={styles.ledgerStrip}>
            <div className={styles.ledgerRow}>
              <span>Goa Trip 2026</span>
              <span style={{ color: "var(--hk-negative)" }}>− ₹3,200</span>
            </div>
            <div className={styles.ledgerRow}>
              <span>Flatmates · HSR Layout</span>
              <span style={{ color: "var(--hk-positive)" }}>+ ₹1,150</span>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <GoogleButton />
          <div className={styles.trustRow}>
            <span>🔒 Encrypted</span>
            <span>✓ Verified</span>
          </div>
          <FootLinks />
          <VersionTag />
          <div className={styles.copyright}>© {new Date().getFullYear()} Hisabkar. All rights reserved.</div>
        </div>
      </div>

      {/* ── Desktop split layout ──────────────────────────────────────── */}
      <div className={styles.desktop}>
        <div className={styles.brandPanel}>
          <div className={styles.brandTop}>
            <span className={styles.brandTopMark}>₹</span> hisabkar
          </div>
          <div className={styles.brandMid}>
            <h1>Every rupee, accounted for.</h1>
            <p>Track shared expenses, split fairly, and settle up — built for trips, flats, and everything in between.</p>
          </div>
          <div className={styles.brandLedger}>
            <div className={styles.brandLedgerRow}>
              <span>Beach Resort · Goa Trip</span>
              <span>₹18,000</span>
            </div>
            <div className={styles.brandLedgerRow}>
              <span>Dinner at Thalassa</span>
              <span>₹4,800</span>
            </div>
            <div className={styles.brandLedgerRow}>
              <span>Cab to Airport</span>
              <span>₹1,200</span>
            </div>
          </div>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.mark}>₹</div>
            <h2>Welcome back</h2>
            <p>Sign in to see your groups and balances.</p>
            <GoogleButton />
            <div className={styles.trustRow}>
              <span>🔒 Encrypted</span>
              <span>✓ Verified</span>
            </div>
            <FootLinks />
            <VersionTag />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
