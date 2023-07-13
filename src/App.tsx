import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ProjectRoutes from "./routes/ProjectRoutes";
import { Logout, addGuestUser, addUser } from "./store/slices/UserSlice";
import jwtDecode from "jwt-decode";
import { guestString, localStorageKey } from "./utils/Constants";
import ServerCheck from "./APIs/ServerCheck";
import styles from "./App.module.css";
import SVGIcons from "./Components/Atoms/SVGIcons/SVGIcons";
interface Decode {
  name: string;
  id: string;
  image: string;
}
function App() {
  const dispatch = useDispatch();
  const queryString = window.location.search.substring(1).split("&")[1];

  const [ServerOn, setServerOn] = useState(true);

  const token = localStorage.getItem(localStorageKey);

  const Server = async () => {
    const res = await ServerCheck();
    if (res?.status == 200) {
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
