const express = require("express");
const router = express.Router();

const { addSeats, getAllSeats, bookSeat } = require("../controllers/Seat");

module.exports = (io) => {
  // Accept io as an argument here and pass it to the controller
  router.get("/getAllSeats", getAllSeats);
  router.post("/addSeats", addSeats);
  router.post("/bookSeats", (req, res) => bookSeat(req, res, io)); // Pass io to the bookSeat controller

  return router;
};
