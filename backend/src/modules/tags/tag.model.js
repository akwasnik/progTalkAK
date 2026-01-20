const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tag", TagSchema);
