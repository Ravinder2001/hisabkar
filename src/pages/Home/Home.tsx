import React from "react";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import UserAvatar from "../../components/Atoms/UserAvatar/UserAvatar";

function Home() {
  return (
    <div>
      <UserAvatar />
      <ExpenseCard />
    </div>
  );
}

export default Home;
