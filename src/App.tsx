import { useEffect } from "react";


import { useDispatch, useSelector } from "react-redux";
import ProjectRoutes from "./routes/ProjectRoutes";
import { Logout, addGuestUser, addUser } from "./store/slices/UserSlice";
import jwtDecode from "jwt-decode";
import { guestString, localStorageKey } from "./utils/Constants";

interface Decode {
  name: string;
  id: string;
  image: string;
}
function App() {
  const dispatch = useDispatch();
  const queryString = window.location.search.substring(1);

  const token = localStorage.getItem(localStorageKey);
  useEffect(() => {
    if (token) {
      const decode: Decode = jwtDecode(token);
      dispatch(addUser(decode));
    } else if (queryString === guestString) {
      dispatch(addGuestUser());
    } else {
      dispatch(Logout());
    }
  }, [token]);
  return <ProjectRoutes />;
}

export default App;
