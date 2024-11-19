import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MakePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seatIds } = location.state || {}; // Get seatIds passed via state

  console.log("Seat IDs received in payment page:", seatIds);

  // Book Now functionality after payment
  const handleMakePayment = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/seat/bookSeats", {
        seatIds,
      });

      if (res?.data?.success) {
        navigate("/");
        alert(res?.data?.message);
      }

    } catch (error) {
      console.error("Error booking seats:", error.message);
      alert(error.response?.data?.message);
      navigate("/");
    }
  };

  return (
    <div className="mt-36 ">
      <h1 className="my-5 text-center text-2xl font-medium">Confirm Payment</h1>
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded"
          onClick={handleMakePayment}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default MakePayment;
