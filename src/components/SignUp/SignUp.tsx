/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OTPComponent from "../OTPComponent/OTPComponent";
import CONSTANTS from "../../utils/constant/Constant";
import { useDispatch } from "react-redux";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";
import useApiFetch from "../../hooks/useAPIFetch";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Label } from "../ui/label";
import { ArrowRight, Mail, User, Wallet } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};

type InitialValuesType = {
  name: string;
  upiAddress: string;
  email: string;
  otp: string;
};

function SignUp(props: PropsType) {
  const dispatch = useDispatch();

  const { fetchData: getSendOTP, response: loginOTPRes } = useApiFetch("");
  const { fetchData: postRegister, response: registerRes } = useApiFetch("");

  const [showOTP, setShowOTP] = useState(false);
  const [animate, setAnimate] = useState("animateIn");
  const [values, setValues] = useState<InitialValuesType>({
    name: "",
    upiAddress: "",
    email: "",
    otp: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (!values.name || !values.email || !values.upiAddress) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    await getSendOTP(CONSTANTS.API_ROUTES.SEND_OTP + `/${values.email}`, {
      method: "GET",
    });
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_IN");
    }, 500);
  };

  const handleLogin = (registerValues: any) => {
    const decode = decodeJWT(registerValues.data.token);
    if (typeof decode === "object" && decode !== null) {
      dispatch(setUserLoggedIn({ ...decode, token: registerValues.data.token }));
    }
  };

  const handleOTPSubmit = async () => {
    if (!values.otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    // Clear any previous errors
    setErrorMessage("");
    await postRegister(CONSTANTS.API_ROUTES.REGISTER, {
      method: "POST",
      data: {
        ...values,
      },
    });
  };

  useEffect(() => {
    if (loginOTPRes?.success == 1) {
      setShowOTP(true);
    }
  }, [loginOTPRes]);

  useEffect(() => {
    if (registerRes?.success == 1) {
      handleLogin(registerRes);
    }
  }, [registerRes]);

  useEffect(() => {
    if (values.name && values.email && values.upiAddress) {
      setErrorMessage(""); // Clear any previous errors
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
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 h-5 w-5" />
                <Input
                  id="input"
                  type="text"
                  placeholder="Enter your name"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 h-5 w-5" />
                <Input
                  id="input"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 h-5 w-5" />
                <Input
                  id="input"
                  type="text"
                  placeholder="Enter your UPI Address"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparentfocus:outline-none"
                  value={values.upiAddress}
                  onChange={(e) => setValues({ ...values, upiAddress: e.target.value })}
                />
              </div>
            </div>
          )}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
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
          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <div onClick={handleClose} className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300 cursor-pointer">
              Sign In
            </div>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
