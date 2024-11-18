import React from "react";

const VipSeat = ({ vip, onClick, isSelected, isBooked }) => {
  return (
    <div
      className={`w-[25px] h-[25px] rounded-[2px] text-center text-sm flex items-center justify-center cursor-pointer 
      ${
        isBooked
          ? "bg-red-500 text-white" // Red for booked seats
          : isSelected
          ? "bg-purple-500 text-white" // Purple for selected seats
          : "border border-[#1ea83c] text-[#1ea83c]" // Green for available seats
      }`}
      onClick={() => !isBooked && onClick(vip)} // Prevent booking of already booked seats
    >
      {vip.seatNumber}
    </div>
  );
};

export default VipSeat;
