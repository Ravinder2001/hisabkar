import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";

type PropsTyps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  message?: string;
};

// Brand palette instead of canvas-confetti's generic web colors — gold, green
// (money/positive), and the app's accent-strong, so the burst reads as "us".
const CONFETTI_COLORS = ["#f0ac4c", "#f7c271", "#49c285", "#2f6fed", "#f1efea"];

export default function SuccessModal({ open, setOpen, title = "Success!", message = "Your expense has been added successfully." }: PropsTyps) {
  const [animate, setAnimate] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => setAnimate(false), 300);
      return;
    }
    const timer = setTimeout(() => {
      setAnimate(true);
      if (confettiRef.current) {
        const rect = confettiRef.current.getBoundingClientRect();
        confetti({
          particleCount: 90,
          spread: 70,
          startVelocity: 32,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: CONFETTI_COLORS,
          shapes: ["circle", "square", "star"],
          zIndex: 9999,
        });
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <ModalComponent isOpen={open} setIsOpen={setOpen} hideCloseBtn>
      <div className={styles.container}>
        <div className={styles.glow} />

        <div className={styles.body} ref={confettiRef}>
          <div className={`${styles.badgeWrap} ${animate ? styles.badgeIn : styles.badgeOut}`}>
            <div className={`${styles.ring} ${styles.ringOuter}`} />
            <div className={`${styles.ring} ${styles.ringInner}`} />

            <div className={styles.orb}>
              <CheckCircle2 size={52} strokeWidth={2.5} className={`${styles.check} ${animate ? styles.checkIn : styles.checkOut}`} />
              {animate &&
                Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className={styles.sparkle}
                    style={{
                      top: `calc(50% + ${Math.sin((i * Math.PI) / 4) * 50}%)`,
                      left: `calc(50% + ${Math.cos((i * Math.PI) / 4) * 50}%)`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
            </div>
          </div>

          <div className={`${styles.textBlock} ${animate ? styles.textIn : styles.textOut}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.message}>{message}</div>
          </div>
        </div>

        <div className={`${styles.actions} ${animate ? styles.actionsIn : styles.actionsOut}`}>
          <button className={`hk-btn-primary ${styles.continueBtn}`} onClick={() => setOpen(false)}>
            Continue
          </button>
        </div>
      </div>
    </ModalComponent>
  );
}
