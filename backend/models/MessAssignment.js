const mongoose = require("mongoose");

const messAssignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messId: {
      type: Number,
      required: true,
    },
    messName: {
      type: String,
      required: true,
    },
    messType: {
      type: String,
      required: true,
    },
    messLocation: {
      type: String,
      required: true,
    },
    assignmentDate: {
      type: Date,
      default: Date.now,
    },
    swapHistory: [
      {
        previousMessId: Number,
        previousMessName: String,
        swapDate: {
          type: Date,
          default: Date.now,
        },
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

messAssignmentSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("MessAssignment", messAssignmentSchema);