import React from "react";
import { Route, Routes } from "react-router-dom";
import { ExpenseRoute, HomeRoute } from "./utils/Constants";
import Home from "./pages/Home/Home";
import AddExpense from "./pages/AddExpense/AddExpense";
import ErrorFallback from "./Error/ErrorFallback";

function App() {
  return (
    <Routes>
      <Route path={HomeRoute} element={<Home />} />
      <Route path={ExpenseRoute} element={<AddExpense />} />

      <Route path="*" element={<ErrorFallback />} />
    </Routes>
  );
}

export default App;
