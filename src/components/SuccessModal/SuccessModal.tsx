import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import confetti from "canvas-confetti";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";

type PropsTyps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SuccessModal(props: PropsTyps) {
  const [animate, setAnimate] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        setAnimate(true);
        if (confettiRef.current) {
          const rect = confettiRef.current.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          confetti({
            particleCount: 100,
            spread: 70,
            origin: {
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            },
            colors: ["#22c55e", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
            zIndex: 9999,
          });
        }
      }, 10);
    }
  }, [open]);

  return (
    <ModalComponent isOpen={props.open} setIsOpen={props.setOpen} hideCloseBtn>
      <div className={styles.container}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-90"
          style={{
            backgroundSize: "200% 200%",
            animation: "gradient-animation 5s ease infinite",
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center py-8" ref={confettiRef}>
          <div
            className={`relative flex items-center justify-center mb-6 transition-all duration-700 ${
              animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-gradient-to-r from-green-400 to-emerald-500 scale-[1.2]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse opacity-40 bg-gradient-to-r from-green-300 to-teal-400 scale-[1.3] animation-delay-300"></div>

            <div className="relative h-24 w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400 shadow-lg shadow-green-500/30"></div>
              <CheckCircle2
                className={`h-24 w-24 text-white z-10 transition-all duration-1000 ${animate ? "stroke-[2.5] scale-100" : "stroke-[0] scale-90"}`}
                strokeWidth={3}
              />
              {animate &&
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-white opacity-0"
                    style={{
                      top: `calc(50% + ${Math.sin((i * Math.PI) / 4) * 50}%)`,
                      left: `calc(50% + ${Math.cos((i * Math.PI) / 4) * 50}%)`,
                      transform: "translate(-50%, -50%)",
                      animation: `dot-animation 1.5s ease infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div
              className={`text-center text-2xl font-bold bg-clip-text text-transparent text-green-500 transition-all duration-500 delay-300 ${
                animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Success!
            </div>
            <div
              className={`text-center text-base transition-all duration-500 delay-500 ${
                animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="text-gray-700 font-medium">Your expense has been added successfully.</span>
            </div>
          </div>
        </div>

        <div className={`flex justify-center relative z-10 transition-all duration-500 delay-700 ${animate ? "opacity-100" : "opacity-0"}`}>
          <Button onClick={() => props.setOpen(false)} className="w-full sm:w-auto bg-green-500 text-white">
            Continue
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
}
