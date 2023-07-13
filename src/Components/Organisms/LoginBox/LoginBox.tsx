import React, { useState } from "react";
import styles from "./styles.module.css";
import { auth, googleAuthProvider } from "../../../firebase.config";
import RegisterUser from "../../../APIs/RegisterUser";

import { localStorageKey, request_succesfully } from "../../../utils/Constants";
import LoginUser from "../../../APIs/LoginUser";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/slices/UserSlice";
import { message } from "antd";
import CircularLoader from "../../Atoms/Loader/CircularLoader/CircularLoader";
import Loading from "../../Atoms/Loader/loading/Loading";
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

function LoginBox() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    auth.signInWithPopup(googleAuthProvider).then(async (response) => {
      if (response) {
        response?.user?.getIdToken().then(async (token: any) => {
          const res = await LoginUser(token);
          if (res.status == request_succesfully) {
            const decode: Decode = jwtDecode(res.token);
            dispatch(addUser(decode));
            localStorage.setItem(localStorageKey, res.token);
            setLoading(false);
            navigate("/");
          } else {
            setLoading(false);
            message.error(res.response.data.message ?? "Something went wrong");
          }
        });
      }
    });
  };

  const handleRegister = () => {
    setLoading(true);

    auth.signInWithPopup(googleAuthProvider).then(async (response: any) => {
      if (response) {
        response.user.getIdToken().then(async (token: any) => {
          const res = await RegisterUser(token);
          if (res.status == request_succesfully) {
            const decode: Decode = jwtDecode(res.token);
            dispatch(addUser(decode));
            localStorage.setItem(localStorageKey, res.token);
            setLoading(false);
            navigate("/");
          } else {
            setLoading(false);
            message.error(res.response.data.message ?? "Something went wrong");
          }
        });
      }
    });
  };
  return loading ? (
    <div className={styles.loader}>
      <Loading />
    </div>
  ) : (
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

export default LoginBox;
