import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ExpenseRoute, HomeRoute } from "./utils/Constants";
import Home from "./pages/Home/Home";
import AddExpense from "./pages/AddExpense/AddExpense";
import ErrorFallback from "./Error/ErrorFallback";
import Welcome from "./components/Welcome/Welcome";

function App() {
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFlag(false);
    }, 4000);
  }, []);
  
  return flag ? (
    <Welcome />
  ) : (
    <Routes>
      <Route path={HomeRoute} element={<Home />} />
      <Route path={ExpenseRoute} element={<AddExpense />} />

      <Route path="*" element={<ErrorFallback />} />
    </Routes>
  );
}

export default App;
