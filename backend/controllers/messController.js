
const MessAssignment = require("../models/MessAssignment");
const Mess = require("../models/Mess"); // We'll create this model next

// Get all available messes
exports.getAllMesses = async (req, res) => {
  try {
    const messes = await Mess.find({});
    res.status(200).json({ success: true, data: messes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's mess assignment
exports.getCurrentMessAssignment = async (req, res) => {
  try {
    const messAssignment = await MessAssignment.findOne({ userId: req.user.id });
    
    if (!messAssignment) {
      return res.status(200).json({ 
        success: true, 
        data: null, 
        message: "No mess assignment found" 
      });
    }
    
    res.status(200).json({ success: true, data: messAssignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register current mess
exports.registerCurrentMess = async (req, res) => {
  try {
    const { messId } = req.body;
    
    // Check if mess exists
    const mess = await Mess.findOne({ id: messId });
    if (!mess) {
      return res.status(404).json({ success: false, message: "Mess not found" });
    }
    
    // Check if user already has a mess assignment
    let messAssignment = await MessAssignment.findOne({ userId: req.user.id });
    
    if (messAssignment) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a mess assignment" 
      });
    }
    
    // Create new mess assignment
    messAssignment = await MessAssignment.create({
      userId: req.user.id,
      messId: mess.id,
      messName: mess.name,
      messType: mess.type,
      messLocation: mess.location,
    });
    
    // Update mess vacancy
    mess.vacancyCount -= 1;
    await mess.save();
    
    res.status(201).json({ 
      success: true, 
      data: messAssignment,
      message: "Mess registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request mess swap
exports.swapMess = async (req, res) => {
  try {
    const { newMessId, reason, comments } = req.body;
    
    // Check if user has a current mess assignment
    const currentAssignment = await MessAssignment.findOne({ userId: req.user.id });
    if (!currentAssignment) {
      return res.status(400).json({ 
        success: false, 
        message: "You must register your current mess before requesting a swap" 
      });
    }
    
    // Check if new mess exists
    const newMess = await Mess.findOne({ id: newMessId });
    if (!newMess) {
      return res.status(404).json({ success: false, message: "New mess not found" });
    }
    
    // Check if new mess has vacancies
    if (newMess.vacancyCount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Selected mess has no vacancies" 
      });
    }
    
    // Get current mess to update vacancy
    const currentMess = await Mess.findOne({ id: currentAssignment.messId });
    if (currentMess) {
      // Increase vacancy of old mess
      currentMess.vacancyCount += 1;
      await currentMess.save();
    }
    
    // Decrease vacancy of new mess
    newMess.vacancyCount -= 1;
    await newMess.save();
    
    // Update swap history
    currentAssignment.swapHistory.push({
      previousMessId: currentAssignment.messId,
      previousMessName: currentAssignment.messName,
      reason: reason || "Not specified",
    });
    
    // Update mess assignment details
    currentAssignment.messId = newMess.id;
    currentAssignment.messName = newMess.name;
    currentAssignment.messType = newMess.type;
    currentAssignment.messLocation = newMess.location;
    
    await currentAssignment.save();
    
    // Generate swap receipt data
    const receiptData = {
      studentName: req.user.name,
      studentId: req.user.id,
      previousMess: currentAssignment.swapHistory[currentAssignment.swapHistory.length - 1].previousMessName,
      newMess: newMess.name,
      swapDate: new Date(),
      reason: reason || "Not specified",
      comments: comments || "",
      transactionId: `SWAP-${Date.now().toString().substring(7)}`,
    };
    
    res.status(200).json({ 
      success: true, 
      data: {
        messAssignment: currentAssignment,
        receipt: receiptData
      },
      message: "Mess swapped successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get swap receipt
exports.getSwapReceipt = async (req, res) => {
  try {
    const { swapId } = req.params;
    const messAssignment = await MessAssignment.findOne({ 
      userId: req.user.id,
      'swapHistory._id': swapId 
    });
    
    if (!messAssignment) {
      return res.status(404).json({ success: false, message: "Swap receipt not found" });
    }
    
    const swapDetails = messAssignment.swapHistory.find(
      swap => swap._id.toString() === swapId
    );
    
    // Generate receipt data
    const receiptData = {
      studentName: req.user.name,
      studentId: req.user.id,
      previousMess: swapDetails.previousMessName,
      newMess: messAssignment.messName,
      swapDate: swapDetails.swapDate,
      reason: swapDetails.reason,
      transactionId: `SWAP-${swapDetails.swapDate.getTime().toString().substring(7)}`,
    };
    
    res.status(200).json({ success: true, data: receiptData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
