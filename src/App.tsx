import { Fragment, useEffect } from "react";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import ErrorFallback from "./Error/ErrorFallback";
import Dashboard from "./Pages/Dashboard";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { addBillList } from "./store/slices/SplitSlice";

function App() {
  const MemberPairs = useSelector((state: RootState) => state.SplitSlice.pairs);
  const dispatch = useDispatch();
  useEffect(() => {
    let pairs = [];

    for (let i = 0; i < MemberPairs.length; i++) {
      const currentObject = MemberPairs[i];

      for (let j = i + 1; j < MemberPairs.length; j++) {
        const nextObject = MemberPairs[j];

        if (
          currentObject.sender === nextObject.receiver &&
          currentObject.receiver === nextObject.sender
        ) {
          pairs.push([currentObject, nextObject]);
          break;
        }
      }
    }
    let mainData = [];
    for (let i = 0; i < pairs.length; i++) {
      let receiver = pairs[i][0].receiver;
      let sender = pairs[i][0].sender;
      let max = pairs[i][0].amount;
      let min = 0;
      let object: any = {};
      for (let j = 1; j < pairs[i].length; j++) {
        if (pairs[i][j].amount > max) {
          min = max;
          max = pairs[i][j].amount;
          receiver = pairs[i][j].receiver;
          sender = pairs[i][j].sender;
        } else {
          min = pairs[i][j].amount;
        }
      }
      object.receiver = receiver;
      object.sender = sender;
      object.amount = max - min;
      mainData.push(object);
    }

    dispatch(addBillList(mainData));
  }, [MemberPairs]);
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<ErrorFallback />} />
      </Routes>
    </Fragment>
  );
}

export default App;
