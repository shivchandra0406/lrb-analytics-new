const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field"],
      unique: true
    },
    actionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actions",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Features", FeatureSchema, "Features");
