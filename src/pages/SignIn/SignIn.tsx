/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";

import showToast from "../../utils/helpers/toastHelper";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import Messages from "../../utils/constant/Messages";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import CustomCircularLoading from "../../components/Atoms/CustomCircularLoading/CustomCircularLoading";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl relative bg-white backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Hisabkar<span className="text-black">.</span>
          </CardTitle>
          <p className="text-center text-sm text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => !googleLoading && handleGoogleSignIn()}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google Logo" className="w-5 h-5 mr-2" />
            {googleLoading ? <CustomCircularLoading /> : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white">
        <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/terms`} className="hover:underline transition-all">
          Terms & Conditions
        </Link>
        <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/privacy`} className="hover:underline transition-all">
          Privacy Policy
        </Link>
        <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/disclaimer`} className="hover:underline transition-all">
          Disclaimer
        </Link>
        <Link to={`${CONSTANTS.PROJECT_ROUTES.LEGAL}/about`} className="hover:underline transition-all">
          About Us
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
