const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field"],
      unique: true
    },
    featureIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Features"
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Actions", ActionSchema, "Actions");
