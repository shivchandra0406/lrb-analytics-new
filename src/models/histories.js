const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: {type:String},
    Role: {type:String},
    refId: { type: String},
    resource: {type:String,required:true},
    action:{type:String},
    context: [{ type: mongoose.Schema.Types.Mixed }]
  },
  { timestamps: true }
);

// ✅ Create a Compound Index
HistorySchema.index(
  { tenentId: 1, userId: 1, refId: 1, resource:1,action:1}
);

module.exports = mongoose.model("Histories", HistorySchema, "Histories");
