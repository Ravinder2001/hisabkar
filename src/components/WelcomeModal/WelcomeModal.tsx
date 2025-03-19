import React, { Dispatch, SetStateAction, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { toggleNewUser } from "../../store/features/userSlice";
import CONSTANTS from "../../utils/constant/Constant";

type PropTypes = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

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
      <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg max-w-full overflow-hidden">
        <div className="text-center">
          <div className="mb-4">
            <span className="inline-block p-2 sm:p-3 bg-blue-500 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome to Hisabkar!</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Your smart financial companion</p>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2">Track Expenses</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Easily log and monitor all your group expenses in one place</p>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2">Create Multiple Groups</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Set up different groups for friends, family, or trips with ease</p>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2">See Simplified Expense Summary</h3>
              <p className="text-gray-600 text-xs sm:text-sm">View optimized transactions to settle debts quickly and clearly</p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700">
              By default, you&apos;ll see a demo group where you can add expenses and try out features. Feel free to explore it, leave it as is, or
              create your own new group!
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4 mt-3 sm:mt-4">
            <button
              onClick={handleClick}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Get Started
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            Questions?{" "}
            <a href={CONSTANTS.PROJECT_ROUTES.SUPPORT} className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
}

export default WelcomeModal;
