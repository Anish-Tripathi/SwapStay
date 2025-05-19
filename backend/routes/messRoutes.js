const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const messController = require("../controllers/messController");

// Get all messes
router.get("/", messController.getAllMesses);

// Get current user's mess assignment
router.get("/assignment", protect, messController.getCurrentMessAssignment);

// Register current mess
router.post("/register", protect, messController.registerCurrentMess);

// Request mess swap
router.post("/swap", protect, messController.swapMess);

// Get swap receipt by ID
router.get("/receipt/:swapId", protect, messController.getSwapReceipt);

module.exports = router;