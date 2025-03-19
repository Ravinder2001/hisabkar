/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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

function SignIn() {
  const dispatch = useDispatch();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Track mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Interactive background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),rgba(0,0,0,0))] opacity-70"
        style={{
          backgroundPosition: `${mousePosition.x / 20}px ${mousePosition.y / 20}px`,
        }}
      ></div>

      {/* Animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl animate-float-slow"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-[15%] left-[25%] w-72 h-72 rounded-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 blur-3xl animate-float-fast"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgtMXYxaDF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAydi0xaC0xdjFoMXptLTIgMmgtMXYxaDF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAydi0xaC0xdjFoMXptLTIgMmgtMXYxaDF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and brand */}
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <div className="relative px-6 py-3 bg-black rounded-full leading-none">
              <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Hisabkar<span className="text-white">.</span>
              </span>
            </div>
          </div>
          <p className="mt-3 text-gray-400 text-sm">Financial management reimagined</p>
        </div>

        {/* Sign-in card */}
        <div className="relative group">
          {/* Card glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          {/* Card content */}
          <div className="relative bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <h2 className="text-xl font-bold text-white mb-6">Sign in to your account</h2>

            {/* Google sign-in button */}
            <button
              onClick={() => !googleLoading && handleGoogleSignIn()}
              className="w-full py-3 px-4 flex items-center justify-center space-x-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition-all duration-300 ease-in-out transform hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              disabled={googleLoading}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google Logo" className="w-5 h-5" />
              <span>{googleLoading ? <CustomCircularLoading /> : "Sign in with Google"}</span>
            </button>

            {/* Decorative divider */}
            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-gray-800"></div>
              <div className="relative px-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full blur-sm opacity-30"></div>
                <span className="relative text-gray-400 text-xs px-2">Secure Login</span>
              </div>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Security badges */}
            <div className="flex justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Encrypted</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Protected</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/terms`} className="hover:text-purple-400 transition-all">
            Terms & Conditions
          </Link>
          <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/privacy`} className="hover:text-purple-400 transition-all">
            Privacy Policy
          </Link>
          <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/disclaimer`} className="hover:text-purple-400 transition-all">
            Disclaimer
          </Link>
          <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/about`} className="hover:text-purple-400 transition-all">
            About Us
          </Link>
          <Link to={CONSTANTS.PROJECT_ROUTES.SUPPORT} className="hover:text-purple-400 transition-all">
            Support
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-gray-600 text-xs">© {new Date().getFullYear()} Hisabkar. All rights reserved.</div>
      </div>
    </div>
  );
}

export default SignIn;
