import { useEffect } from "react";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import ProjectRoutes from "./routes/ProjectRoutes";
import { Logout, addUser } from "./store/slices/UserSlice";
import jwtDecode from "jwt-decode";

interface Decode {
  name: string;
  id: string;
  image: string;
}
function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("hisabToken");
  useEffect(() => {
    if (token) {
      const decode: Decode = jwtDecode(token);
      dispatch(addUser(decode));
    } else {
      dispatch(Logout());
    }
  }, [token]);
  return <ProjectRoutes />;
}

export default App;
