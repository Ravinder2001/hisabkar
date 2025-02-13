import React from "react";
import CountUp from "react-countup";

type PropTypes = {
  count: number;
};

function CustomCountUp(props: PropTypes) {
  return <CountUp end={props.count} />;
}

export default CustomCountUp;
