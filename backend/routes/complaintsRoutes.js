const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getUserComplaints,
    getComplaintById,
    updateComplaintStatus,
    getEvidenceFile
} = require('../controllers/complaintsController');

const uploadMiddleware = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');


router.get('/my-complaints', protect, getUserComplaints);
router.get('/evidence/:complaintId', protect, getEvidenceFile); 
router.get('/', protect, getUserComplaints);
router.post('/', protect, uploadMiddleware.single('evidence'), createComplaint);
router.get('/:id', protect, getComplaintById); 
router.put('/:id', protect, updateComplaintStatus);

module.exports = router;