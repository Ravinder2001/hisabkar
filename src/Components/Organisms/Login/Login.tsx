import React from "react";
import styles from "./styles.module.css";
import { auth, googleAuthProvider } from "../../../firebase.config";
import RegisterUser from "../../../APIs/RegisterUser";
import { toast } from "react-toastify";
import { ErroToast } from "../../../utils/ToastStyle";
import { localStorageKey, request_succesfully } from "../../../utils/Constants";
import LoginUser from "../../../APIs/LoginUser";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/slices/UserSlice";
interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface Decode {
  name: string;
  id: string;
  image: string;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    auth.signInWithPopup(googleAuthProvider).then(async (response) => {
      const profile = response?.additionalUserInfo?.profile as UserProfile;

      const res = await LoginUser(profile.email);
      if (res.status == request_succesfully) {
        const decode: Decode = jwtDecode(res.token);
        dispatch(addUser(decode));
        localStorage.setItem(localStorageKey, res.token);
        navigate("/");
      } else {
        toast.error(
          res.response.data.message ?? "Something went wrong",
          ErroToast
        );
      }
    });
  };

  const handleRegister = () => {
    const num1 = Math.floor(Math.random() * 100);

    auth.signInWithPopup(googleAuthProvider).then(async (response) => {
      const profile = response?.additionalUserInfo?.profile as UserProfile;
      let object = {
        name: profile.name,
        email: profile.email,
        image:
          profile.picture || profile.picture !== ""
            ? profile.picture
            : `https://api.multiavatar.com/${num1}.png`,
      };

      const res = await RegisterUser(object);
      if (res.status == request_succesfully) {
        const decode: Decode = jwtDecode(res.token);
        dispatch(addUser(decode));
        localStorage.setItem(localStorageKey, res.token);
        navigate("/");
      } else {
        toast.error(
          res.response.data.message ?? "Something went wrong",
          ErroToast
        );
      }
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Welcome to hisabkar.com</div>
      <div className={styles.buttonBox}>
        <div className={styles.button} onClick={handleLogin}>
          Login
        </div>
        <div className={styles.button} onClick={handleRegister}>
          Sign Up
        </div>
      </div>
    </div>
  );
}

export default Login;
