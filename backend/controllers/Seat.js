const Seat = require("../models/Seat");

exports.addSeats = async (req, res) => {
  try {
    const { regular, vip, bolcony } = req.body;

    // Create seats for 'regular' category and add their IDs to seatIds
    for (let i = 0; i < regular.seat; i++) {
      await Seat.create({
        seatType: regular.name,
        seatNumber: i + 1,
        seatPrice: regular.price,
        seatStatus: "Available",
      });
    }

    // Create seats for 'bolcony' category and add their IDs to seatIds
    for (let i = 0; i < bolcony.seat; i++) {
      await Seat.create({
        seatType: bolcony.name,
        seatNumber: i + 1,
        seatPrice: bolcony.price,
        seatStatus: "Available",
      });
    }

    // Create seats for 'vip' category and add their IDs to seatIds
    for (let i = 0; i < vip.seat; i++) {
      await Seat.create({
        seatType: vip.name,
        seatNumber: i + 1,
        seatPrice: vip.price,
        seatStatus: "Available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Screen updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while updating screen",
    });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();

    return res.status(200).json({
      success: true,
      data: seats,
      message: "Seats fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while getting seats",
    });
  }
};

exports.bookSeat = async (req, res, io) => {
  try {
    const { seatIds } = req.body;
    console.log("req body: ", seatIds);

    // Update the status of each selected seat to "Booked"
    const updatedSeats = await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { seatStatus: "Booked" } }, // Corrected field name here
      { new: true }
    );

    if (!updatedSeats || updatedSeats.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Seats not found or already booked" });
    }

    // Emit event to notify clients about the updated seats
    io.emit("seatsUpdated", seatIds); // Emit an array of seatIds

    res
      .status(200)
      .json({ message: "Seats booked successfully", seats: updatedSeats });
  } catch (error) {
    console.error("Error booking seat:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
