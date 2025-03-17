import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
const JoinGroup: React.FC = () => {
  const navigate = useNavigate();
  const { group_code } = useParams<{ group_code?: string }>();
  const { fetchData: joinGroup, response: joinRes } = useApiFetch("");

  useEffect(() => {
    if (group_code) {
      // Call backend API to join the group
      joinGroup(`${CONSTANTS.API_ROUTES.JOIN_GROUP}${group_code}`, { method: "GET" });
    }
  }, [group_code]);

  useEffect(() => {
    if (joinRes?.success) {
      // Redirect user to the group page after joining
      navigate(`${CONSTANTS.PROJECT_ROUTES.GROUP}/${joinRes.data.group_id}`);
    } else {
      navigate(CONSTANTS.PROJECT_ROUTES.HOME);
    }
  }, [joinRes]);
  return <div>Joining group...</div>;
};

export default JoinGroup;
