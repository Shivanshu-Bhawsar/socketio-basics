const express = require("express");
const router = express.Router();

const {
  addSeats,
  getAllSeats,
  bookSeats,
  reserveSeats,
} = require("../controllers/Seat");

module.exports = (io) => {
  // Accept io as an argument here and pass it to the controller
  router.get("/getAllSeats", getAllSeats);
  router.post("/addSeats", addSeats);
  router.post("/reserveSeats", (req, res) => reserveSeats(req, res, io));
  router.post("/bookSeats", (req, res) => bookSeats(req, res, io));

  return router;
};
