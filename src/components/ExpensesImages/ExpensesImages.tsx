import React from "react";
import Medical from "../../assets/images/medical.png";
import Monthly from "../../assets/images/monthly.png";
import Others from "../../assets/images/Others.png";
import Personal from "../../assets/images/personal.png";
import Travel from "../../assets/images/travel.png";
import Utility from "../../assets/images/utility.png";
type props = {
  name: string;
};
function ExpensesImages(props: props) {
  switch (props.name) {
    case "Medical":
      return <img src={Medical} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    case "Monthly":
      return <img src={Monthly} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    case "Others":
      return <img src={Others} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    case "Personal":
      return <img src={Personal} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    case "Travel":
      return <img src={Travel} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    case "Utility":
      return <img src={Utility} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />;
    default:
      return null;
  }
}

export default ExpensesImages;
