import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ModalComponent from "../ModalComponent/ModalComponent";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { toggleNewUser } from "../../store/features/userSlice";
import CONSTANTS from "../../utils/constant/Constant";
import styles from "./style.module.css";

type PropTypes = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const FEATURES = [
  {
    title: "Track Expenses",
    text: "Easily log and monitor all your group expenses in one place",
    color: "var(--hk-accent)",
  },
  {
    title: "Create Multiple Groups",
    text: "Set up different groups for friends, family, or trips with ease",
    color: "var(--hk-focus)",
  },
  {
    title: "See Simplified Expense Summary",
    text: "View optimized transactions to settle debts quickly and clearly",
    color: "var(--hk-positive)",
  },
];

function WelcomeModal(props: PropTypes) {
  const dispatch = useDispatch();

  const handleClick = () => {
    props.setIsOpen(false);
    dispatch(toggleNewUser());
  };

  useEffect(() => {
    // Trigger confetti when modal opens
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Add another burst of confetti after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 700);
  }, []);

  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.setIsOpen} hideCloseBtn>
      <div className={styles.wrapper}>
        <div className={styles.iconWrap}>
          <Sparkles size={22} />
        </div>

        <h1 className={styles.title}>Welcome to Hisabkar!</h1>
        <p className={styles.subtitle}>Your smart financial companion</p>

        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard} style={{ borderLeftColor: feature.color }}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>

        <p className={styles.note}>
          By default, you&apos;ll see a demo group where you can add expenses and try out features. Feel free to explore it, leave it as is, or create
          your own new group!
        </p>

        <div className={styles.actions}>
          <button className="hk-btn-primary" onClick={handleClick}>
            Get Started
          </button>
        </div>

        <div className={styles.footer}>
          Questions? <Link to={CONSTANTS.PROJECT_ROUTES.SUPPORT}>Contact Support</Link>
        </div>
      </div>
    </ModalComponent>
  );
}

export default WelcomeModal;
