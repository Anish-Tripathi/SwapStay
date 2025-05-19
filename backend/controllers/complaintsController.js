
const Complaint = require('../models/Complaint');
const asyncHandler = require('../middleware/asyncHandler');
const fs = require('fs');
const path = require('path');

exports.createComplaint = asyncHandler(async (req, res) => {

  const complaintData = {
    type: req.body.type,
    priority: req.body.priority,
    email: req.body.email,
    roomNumber: req.body.roomNumber,
    subject: req.body.subject,
    description: req.body.description
  };

  // If user is authenticated, associate with user ID
  if (req.user) {
    complaintData.userId = req.user.id;
  }

  // Handle file upload if provided
  if (req.file) {
    complaintData.evidenceFile = req.file.path;
  }

  // Create new complaint
  const complaint = await Complaint.create(complaintData);

  res.status(201).json({
    success: true,
    data: {
      complaintId: complaint.complaintId,
      id: complaint._id
    },
    message: 'Complaint submitted successfully'
  });
});

exports.getUserComplaints = asyncHandler(async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated, filter by user ID
    if (req.user) {
     
      query.userId = req.user.id;
    } else if (req.query.email) {
      query.email = req.query.email;
    } else {
      
      return res.status(400).json({
        success: false,
        message: 'Email is required to fetch complaints'
      });
    }

    const complaints = await Complaint.find(query)
      .sort({ date: -1 })
      .select('type priority status subject date complaintId');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

exports.getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  if (req.user && !req.user.isAdmin && complaint.userId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this complaint'
    });
  }

  const complaintResponse = complaint.toObject();
  
  if (complaint.evidenceFile) {
    complaintResponse.evidenceFiles = [{
      name: path.basename(complaint.evidenceFile),
      url: `/api/complaints/evidence/${complaint._id}`,
      type: getFileType(complaint.evidenceFile)
    }];
  }

  res.status(200).json({
    success: true,
    data: complaintResponse
  });
});

// Helper function to determine file type
function getFileType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

exports.getEvidenceFile = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint || !complaint.evidenceFile) {
      return res.status(404).send('File not found');
    }
    
    // Check if the file exists
    const filePath = complaint.evidenceFile;
    if (fs.existsSync(filePath)) {
      return res.sendFile(path.resolve(filePath));
    } else {
      return res.status(404).send('File not found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

exports.updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.status = status;
  await complaint.save();

  res.status(200).json({
    success: true,
    data: complaint
  });
});