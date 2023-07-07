import { useState } from "react";
import styles from "./styles.module.css";
import Heading from "../../Atoms/Headings/Heading";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { localStorageKey } from "../../../utils/Constants";
import { RootState } from "../../../store/store";
import { Logout } from "../../../store/slices/UserSlice";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const User = useSelector((state: RootState) => state.UserSlice);

  const [open, setOpen] = useState<boolean>(true);

  const handleLogout = () => {
    localStorage.removeItem(localStorageKey);
    navigate("/login");
    dispatch(Logout());
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
            <div style={{ color: "black" }} className={styles.username}>{User.name}</div>
            {!User.guestUser ? (
              <div className={styles.id}>id_{User.id}</div>
            ) : (
              <div className={styles.id}>Login & Sign Up</div>
            )}
          </div>
        </div>

        {!User.guestUser && (
          <div className={styles.logoutBox} onClick={handleLogout}>
            <ReactIcons name="RiLogoutBoxFill" size={25} />
            <div style={{fontSize:'14px'}}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
