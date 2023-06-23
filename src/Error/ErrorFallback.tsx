import React from "react";
import { Link } from "react-router-dom";

function ErrorFallback() {
  return (
    <div>
      <div>Oops! Something went wrong.</div>
      <button>
        <Link to="/">Home</Link>
      </button>
    </div>
  );
}

export default ErrorFallback;
