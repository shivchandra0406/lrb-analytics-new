const mongoose = require("mongoose");

const IP2LocSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true }, // Ensure unique IP entries
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  { timestamps: true } // Auto-add createdAt & updatedAt fields
);

// ✅ Create an index for faster lookup by IP
IP2LocSchema.index({ IP: 1 });

module.exports = mongoose.model("IP2Locs", IP2LocSchema, "IP2Locs");
