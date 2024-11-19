import React from "react";

const BalconySeat = ({
  balcony,
  onClick,
  isSelected,
  isBooked,
  isReserved,
}) => {
  return (
    <div
      className={`w-[25px] h-[25px] rounded-[2px] text-center text-sm flex items-center justify-center cursor-pointer 
      ${
        isBooked
          ? "bg-red-500 text-white"
          : isReserved
          ? "bg-gray-500 text-white"
          : isSelected
          ? "bg-purple-500 text-white"
          : "border border-[#1ea83c] text-[#1ea83c]"
      }`}
      onClick={() => !isBooked && !isReserved && onClick(balcony)}
    >
      {balcony.seatNumber}
    </div>
  );
};

export default BalconySeat;
