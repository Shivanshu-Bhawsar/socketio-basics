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

exports.reserveSeats = async (req, res, io) => {
  try {
    // fetching seats ids
    const { seatIds } = req.body;

    // check if seats are already reserved or not
    const seats = await Seat.find({
      _id: { $in: seatIds },
      seatStatus: "Available",
    });

    if (seats.length === 0 || seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Seats are already reserved or unavailable2.",
      });
    }

    // Reserve the seats
    const result = await Seat.updateMany(
      { _id: { $in: seatIds }, seatStatus: "Available" },
      { $set: { seatStatus: "Reserved", reservedAt: new Date() } }
    );
    // console.log("reserved res: ", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Seats are already reserved or unavailable.",
      });
    }

    // Schedule to revert the reserved status after 5 minutes
    setTimeout(async () => {
      try {
        // Find the reserved seats that haven't been booked yet (within the last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);

        // Check if any of the reserved seats are still reserved after 5 minutes
        const seatsToRevert = await Seat.find({
          _id: { $in: seatIds },
          seatStatus: "Reserved",
          reservedAt: { $lte: fiveMinutesAgo },
        });
        console.log("seatsToRevert: ", seatsToRevert);

        // If there are seats to revert, change their status to Available
        if (seatsToRevert.length > 0) {
          // Update only those seats that are still reserved
          await Seat.updateMany(
            {
              _id: { $in: seatsToRevert.map((seat) => seat._id) },
              seatStatus: "Reserved",
            },
            { $set: { seatStatus: "Available", reservedAt: null } }
          );
          console.log(`Reverted seats ${seatIds} to Available`);
          io.emit("seatsToRevert", seatIds);
        }
      } catch (error) {
        console.error("Error reverting reserved seats:", error.message);
      }
    }, 1 * 60 * 1000); // 5 minutes in milliseconds

    // Emit event to notify clients about the updated seats
    io.emit("reservedSeats", seatIds); // Emit an array of seatIds

    res.status(200).json({
      success: true,
      message:
        "Seats reserved successfully. They will be reverted if not booked within 5 minutes.",
    });
  } catch (error) {
    console.error("Error reserving seats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while reserving seats.",
    });
  }
};

exports.bookSeats = async (req, res, io) => {
  try {
    // fetching seat ids
    const { seatIds } = req.body;

    // Mark the seats as Booked
    const result = await Seat.updateMany(
      { _id: { $in: seatIds }, seatStatus: "Reserved" },
      { $set: { seatStatus: "Booked", reservedAt: null } }
    );
    console.log("book res: ", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Seats are not reserved or already booked.",
      });
    }

    // Emit event to notify clients about the updated seats
    io.emit("seatsUpdated", seatIds);

    res.status(200).json({
      success: true,
      message: "Seats booked successfully.",
    });
  } catch (error) {
    console.error("Error booking seats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while booking seats.",
    });
  }
};
