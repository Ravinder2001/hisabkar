import { useEffect } from "react";
import HomeTemplate from "../Components/Templates/HomeTemplate/HomeTemplate";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const data = localStorage.getItem("persist:root");
    if (data) {
      navigate("/dashboard");
    }

  }, []);

  return <HomeTemplate />;
}

export default Home;
