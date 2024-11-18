import React, { useEffect, useState } from "react";
import axios from "axios";
import VipSeat from "./VipSeat";
import BolconySeat from "./BalconySeat";
import RegularSeat from "./RegularSeat";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ShowSeats = () => {
  const [seatArray, setSeatArray] = useState([]);
  const [regularSeat, setRegularSeat] = useState([]);
  const [balconySeat, setBalconySeat] = useState([]);
  const [vipSeat, setVipSeat] = useState([]);

  const [mySeats, setMySeats] = useState([]);

  const fetchData = async () => {
    console.log("fetch");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/seat/getAllSeats"
      );
      console.log("Data:", response.data);
      setSeatArray(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Handle seat click
  const toggleSeatSelection = (seat) => {
    console.log("click");
    if (mySeats.some((selectedSeat) => selectedSeat._id === seat._id)) {
      // Remove seat from selection
      setMySeats(
        mySeats.filter((selectedSeat) => selectedSeat._id !== seat._id)
      );
    } else {
      // Add seat to selection
      setMySeats([...mySeats, seat]);
    }
  };

  // Book Now functionality
  const handleBookNow = async () => {
    try {
      const seatIds = mySeats.map((seat) => seat._id);
      console.log("Book: ", seatIds);
      await axios.post("http://localhost:5000/api/v1/seat/bookSeats", {
        seatIds,
      });

      // // Emit socket event to notify other users
      // socket.emit("seatsBooked", seatIds);

      // Clear mySeats after booking
      setMySeats([]);
    } catch (error) {
      console.error("Error booking seats:", error.message);
    }
  };

  useEffect(() => {
    console.log("Setting up socket listener");

    socket.on("seatsUpdated", (updatedSeatIds) => {
      console.log("on:", updatedSeatIds);
      // Update the seat status directly in the state
      setSeatArray((prevSeats) =>
        prevSeats.map((seat) =>
          updatedSeatIds.includes(seat._id)
            ? { ...seat, seatStatus: "Booked" } // Update status to "Booked"
            : seat
        )
      );
      console.log("Seat status updated");
    });

    console.log("Socket listener is set up");

    return () => {
      console.log("Cleanup: Removing socket listener");
      socket.off("seatsUpdated");
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterSeats = () => {
      if (seatArray.length > 0) {
        setRegularSeat(seatArray.filter((seat) => seat.seatType === "REGULAR"));
        setBalconySeat(seatArray.filter((seat) => seat.seatType === "BALCONY"));
        setVipSeat(seatArray.filter((seat) => seat.seatType === "VIP"));
      } else {
        setRegularSeat([]);
        setBalconySeat([]);
        setVipSeat([]);
      }
    };
    filterSeats();
  }, [seatArray]);

  return (
    <div>
      <h1 className="mt-7 mb-7 text-center text-2xl font-medium">Seats</h1>
      <div>
        {seatArray.length === 0 ? (
          <div className="text-center">No Show Found</div>
        ) : (
          <div>
            <div className="w-screen max-h-max bg-[rgb(250,250,250)] flex items-center justify-center flex-col gap-4">
              {/* VIP Seats */}
              <div className="w-[50%] flex items-center justify-center gap-2 p-2">
                {vipSeat.length !== 0 && (
                  <div className="w-full flex items-center justify-center flex-col">
                    <div className="w-[80%] border-b-[0.5px] border-b-[rgb(237,237,237)]">
                      {`Rs. ${vipSeat[0].seatPrice} VIP`}
                    </div>
                    <div className="grid grid-cols-5 gap-4 my-5">
                      {vipSeat.map((vip) => (
                        <VipSeat
                          vip={vip}
                          key={vip._id}
                          onClick={() => toggleSeatSelection(vip)}
                          isSelected={mySeats.some(
                            (seat) => seat._id === vip._id
                          )}
                          isBooked={vip.seatStatus === "Booked"}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Balcony Seats */}
              <div className="w-[50%] flex items-center justify-center gap-2 p-2">
                {balconySeat.length !== 0 && (
                  <div className="w-full flex items-center justify-center flex-col">
                    <div className="w-[80%] border-b-[0.5px] border-b-[rgb(237,237,237)]">
                      {`Rs. ${balconySeat[0].seatPrice} BALCONY`}
                    </div>
                    <div className="grid grid-cols-5 gap-4 my-5">
                      {balconySeat.map((balcony) => (
                        <BolconySeat
                          balcony={balcony}
                          key={balcony._id}
                          onClick={() => toggleSeatSelection(balcony)}
                          isSelected={mySeats.some(
                            (seat) => seat._id === balcony._id
                          )}
                          isBooked={balcony.seatStatus === "Booked"}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Regular Seats */}
              <div className="w-[50%] flex items-center justify-center gap-2 p-2">
                {regularSeat.length !== 0 && (
                  <div className="w-full flex items-center justify-center flex-col">
                    <div className="w-[80%] border-b-[0.5px] border-b-[rgb(237,237,237)]">
                      {`Rs. ${regularSeat[0].seatPrice} REGULAR`}
                    </div>
                    <div className="grid grid-cols-5 gap-4 my-5">
                      {regularSeat.map((regular) => (
                        <RegularSeat
                          regular={regular}
                          key={regular._id}
                          onClick={() => toggleSeatSelection(regular)}
                          isSelected={mySeats.some(
                            (seat) => seat._id === regular._id
                          )}
                          isBooked={regular.seatStatus === "Booked"}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center my-5">
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded"
                onClick={handleBookNow}
                disabled={mySeats.length === 0}
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSeats;
