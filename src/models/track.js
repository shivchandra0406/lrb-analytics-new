const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true },
    userId: { type: String, required: true },
    refId: { type: String},
    featureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Features",
      required: true,
    },
    sequence: {
      type: mongoose.Schema.Types.BigInt,  
      default: 0
    },
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actions",
      required: true,
    },
    source: { type: String },
    deviceId: { type: String },
    deviceType: { type: String },
    osVer: { type: String },
    appVer: { type: String },
    iP: { type: String },
  },
  { timestamps: true }
);

// ✅ Create a Compound Index
TrackSchema.index({
  tenentId: 1,
  userId: 1,
  refId: 1,
  featureId: 1,
  actionId: 1,
});

module.exports = mongoose.model("Tracks", TrackSchema, "Tracks");
