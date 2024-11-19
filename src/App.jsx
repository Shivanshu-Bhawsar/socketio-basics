import React from "react";
import { Route, Routes } from "react-router-dom";
import ShowSeats from "./components/ShowSeats";
import MakePayment from "./components/MakePayment";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ShowSeats />}></Route>
        <Route path="/make-payment" element={<MakePayment />}></Route>
      </Routes>
    </div>
  );
};

export default App;
