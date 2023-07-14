import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Heading from "../../Atoms/Headings/Heading";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import { localStorageKey } from "../../../utils/Constants";
import { RootState } from "../../../store/store";
import { Logout } from "../../../store/slices/UserSlice";

import styles from "./styles.module.css";

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const User = useSelector((state: RootState) => state.UserSlice);

  const handleLogout = () => {
    localStorage.removeItem(localStorageKey);
    navigate("/login");
    dispatch(Logout());
  };
  const handleHome = () => {
    navigate("/");
  };
  const handleGraph = () => {
    if (User.guestUser) {
      const urlParams = new URLSearchParams(location.search);
      let extractedValue = urlParams.get("id");

      navigate(`/graph/${extractedValue}`);
    } else {
      navigate(`/graph/${User.id}`);
    }
  };
  const handleProfile = () => {
    if (User.guestUser) {
      navigate("/login");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <Heading text="hisabkar.com" />
      </div>
      <div className={styles.subCon}>
        <div className={styles.profileCon}>
          <img
            src={User.image}
            alt="img"
            className={styles.img}
            onError={({ currentTarget }) => {
              currentTarget.src =
                "https://img.icons8.com/?size=512&id=zXd7HOdmWPxf&format=png";
            }}
          />
          <div className={styles.box} onClick={handleProfile}>
            <div style={{ color: "black" }} className={styles.username}>
              {User.name}
            </div>
            {!User.guestUser ? (
              <div className={styles.id}>id_{User.id}</div>
            ) : (
              <div className={styles.id}>Login & Sign Up</div>
            )}
          </div>
        </div>

        <div className={styles.iconBox}>
          {!User.guestUser && (
            <div className={styles.logoutBox} onClick={handleLogout}>
              <ReactIcons name="RiLogoutBoxFill" size={22} />
              <div className={styles.iconText}>Logout</div>
            </div>
          )}
          {location.pathname.split("/")[1] !== "graph" && (
            <div className={styles.logoutBox} onClick={handleGraph}>
              <ReactIcons name="SlGraph" size={22} />
              <div className={styles.iconText}>Analysis</div>
            </div>
          )}
          {!User.guestUser && (
            <>
              {location.pathname !== "/" && (
                <div className={styles.logoutBox} onClick={handleHome}>
                  <ReactIcons name="AiFillHome" size={22} />
                  <div className={styles.iconText}>Home</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
