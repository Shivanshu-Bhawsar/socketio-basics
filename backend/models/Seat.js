const mongoose = require("mongoose");

const SeatType = ["REGULAR", "VIP", "BALCONY"];
const SeatStatus = ["Available", "Booked"];

const seatSchema = new mongoose.Schema({
  seatType: {
    type: String,
    enum: SeatType,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  seatPrice: {
    type: Number,
    required: true,
  },
  seatStatus: {
    type: String,
    enum: SeatStatus,
    required: true,
  },
});

module.exports = mongoose.model("Seat", seatSchema);
