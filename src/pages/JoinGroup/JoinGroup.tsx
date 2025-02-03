import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setReDirectURL } from "../../store/features/userSlice";
import CONSTANTS from "../../utils/constant/Constant";
const JoinGroup: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReDirectURL(CONSTANTS.PROJECT_ROUTES.HOME));
  }, []);
  return <div>Joining group...</div>;
};

export default JoinGroup;
