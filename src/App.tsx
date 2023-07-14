import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

import ProjectRoutes from "./routes/ProjectRoutes";
import ServerCheck from "./APIs/ServerCheck";
import SVGIcons from "./Components/Atoms/SVGIcons/SVGIcons";
import { Logout, addGuestUser, addUser } from "./store/slices/UserSlice";
import { guestString, localStorageKey, request_succesfully } from "./utils/Constants";

import styles from "./App.module.css";
interface Decode {
  name: string;
  id: string;
  image: string;
}
function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem(localStorageKey);
  const queryString = window.location.search.substring(1).split("&")[1];

  const [ServerOn, setServerOn] = useState(true);

  const Server = async () => {
    const res = await ServerCheck();
    if (res?.status === request_succesfully) {
      setServerOn(true);
    } else {
      setServerOn(false);
    }
  };
  
  useEffect(() => {
    Server();
    if (token) {
      const decode: Decode = jwtDecode(token);
      dispatch(addUser(decode));
    } else if (queryString === guestString) {
      dispatch(addGuestUser());
    } else {
      dispatch(Logout());
    }
  }, [token]);
  return ServerOn ? (
    <ProjectRoutes />
  ) : (
    <div className={styles.serverCon}>
      <div>
        <SVGIcons/>
      </div>
      <div className={styles.text}>Server is offline!</div>
    </div>
  );
}

export default App;
