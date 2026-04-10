import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import "./style.css";

const STARTUP_MESSAGES = [
  "Securing your financial data...",
  "Waking up the digital accountant...",
  "Preparing your group balances...",
  "Optimizing shared expenses...",
];

function Loader() {
  const [seconds, setSeconds] = useState(60);
  const [messageIndex, setMessageIndex] = useState(0);

  // Get full name from Redux
  const fullName = useSelector((state: RootState) => state?.user?.name);
  const firstName = fullName ? fullName.split(" ")[0] : "Friend";

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STARTUP_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="startup-root">
      {/* Background animated elements */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="startup-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="logo-section"
        >
          <div className="logo-icon-wrapper">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="logo-ring" />
            <span className="logo-symbol">₹</span>
          </div>
          <motion.h1
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0.05em", opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="logo-text"
          >
            HISAB<span>KAR</span>
          </motion.h1>
        </motion.div>

        <div className="interaction-zone">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="startup-message"
            >
              {STARTUP_MESSAGES[messageIndex]}
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="greeting-section">
            <p className="personalized-text">Welcome back, {firstName}!</p>
            <div className="feature-badges">
              <div className="badge">
                <ShieldCheck size={14} /> Secure
              </div>
              <div className="badge">
                <Zap size={14} /> Fast
              </div>
              <div className="badge">
                <Sparkles size={14} /> Smart
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="server-status">
          <div className="progress-container">
            <motion.div className="progress-bar" animate={{ width: `${((60 - seconds) / 60) * 100}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="status-note">
            Server is warming up... Expected in <strong>{seconds}s</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Loader;
