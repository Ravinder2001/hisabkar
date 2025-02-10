/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";

import OTPComponent from "../OTPComponent/OTPComponent";
import showToast from "../../utils/helpers/toastHelper";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import Messages from "../../utils/constant/Messages";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Label } from "../ui/label";
import { ArrowRight, Mail } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};

type ValuesType = {
  email: string;
  otp: string;
};

function SignIn(props: PropsType) {
  const dispatch = useDispatch();

  const { fetchData: postGoogleSignIn, response: googleSignInRes } = useApiFetch("");
  const { fetchData: getSendLoginOTP, response: loginOTPRes } = useApiFetch("");
  const { fetchData: postLogin, response: loginRes } = useApiFetch("");

  const [showOTP, setShowOTP] = useState(false);
  const [animate, setAnimate] = useState("animateIn");
  const [values, setValues] = useState<ValuesType>({
    email: "",
    otp: "",
  });

  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!values.email) {
      setError("Email is required.");
      return;
    }

    await getSendLoginOTP(CONSTANTS.API_ROUTES.SEND_LOGIN_OTP + `/${values.email}`, {
      method: "GET",
    });
    setValues((prev) => ({
      ...prev,
      email: values.email,
    }));
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_UP");
    }, 500); // Match animation duration
  };

  const login = useGoogleLogin({
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
    const decode = decodeJWT(values.data.token);
    if (typeof decode === "object" && decode !== null) {
      dispatch(setUserLoggedIn({ ...decode, token: values.data.token }));
    }
  };

  const handleOTPSubmit = async () => {
    if (!values.otp && values.otp.length !== 6) {
      setError("OTP is required.");
      return;
    }

    await postLogin(CONSTANTS.API_ROUTES.LOGIN, {
      method: "POST",
      data: {
        email: values.email,
        otp: values.otp,
      },
    });
  };

  const showNotification = () => {
    if (!("Notification" in window)) {
      showToast("This browser does not support notifications.", "error");
      return;
    }

    // Request notification permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Expense Splitter", {
          body: "Your expense has been updated!",
          icon: "/icon.png", // Replace with your app icon path
        });
      } else {
        showToast("Permission denied for notifications.", "error");
      }
    });
  };

  useEffect(() => {
    if (loginOTPRes?.success === 1) {
      setShowOTP(true);
    }
  }, [loginOTPRes]);

  useEffect(() => {
    if (googleSignInRes?.success === 1) {
      handleLogin(googleSignInRes);
    }
  }, [googleSignInRes]);

  useEffect(() => {
    if (loginRes?.success === 1) {
      handleLogin(loginRes);
    }
  }, [loginRes]);

  // Reset error message when both email and otp are filled
  useEffect(() => {
    if (values.email) {
      setError("");
    }
  }, [values]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[100px]" />
      <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl relative bg-white backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Hisabkar<span className="text-black">.</span>
          </CardTitle>
          <p className="text-center text-sm text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {showOTP ? (
            <OTPComponent animateClassName={animate} setValues={setValues} values={values} />
          ) : (
            <div className="space-y-2">
              {/* <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label> */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <Button
            onClick={!showOTP ? handleSubmit : handleOTPSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <Button
            onClick={() => login()}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google Logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <div onClick={handleClose} className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300 cursor-pointer">
              Create an account
            </div>
          </p>
          <ButtonComponent onClick={showNotification} text="Click me" />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
