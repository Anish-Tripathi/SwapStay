const mongoose = require("mongoose");

const messSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Veg", "Non-Veg", "Veg/Non-Veg", "Mixed"],
    },
    vacancyCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    menuPreview: {
      type: String,
    },
    timings: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    facilities: [String],
    weeklyMenu: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mess", messSchema);