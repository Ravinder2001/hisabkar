import React from "react";
import "./style.css";

function Loader() {
  return (
    <div className="card">
      <div className="loader">
        <p>...loading</p>
        <div className="words">
          <span className="word">Groups</span>
          <span className="word">Expenses</span>
          <span className="word">Bills</span>
          <span className="word">Balances</span>
          <span className="word">calculations</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
