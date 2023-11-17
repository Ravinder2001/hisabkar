import { useEffect } from "react";
import ProjectRoutes from "./routes/ProjectRoutes";
import { DashboardRoute, localStorageKey } from "./utils/Constants";
import { jwtDecode } from "jwt-decode";
import { AddUser, Logout } from "./store/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
interface decode {
  exp: number;
  iat: number;
  id: string;
  username: string;
  image: string;
}
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem(localStorageKey);
    if (token) {
      const decode: decode = jwtDecode(token);
      if (decode) {
        let exp = decode.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp > currentTime) {
          dispatch(AddUser(decode));
          navigate(DashboardRoute);
        } else {
          localStorage.removeItem(localStorageKey);
          dispatch(Logout());
        }
      } else {
        localStorage.removeItem(localStorageKey);
        dispatch(Logout());
      }
    } else {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
    }
  }, []);
  return <ProjectRoutes />;
}

export default App;
