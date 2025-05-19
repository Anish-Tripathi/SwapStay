const multer = require('multer');
const path = require('path');

// Set storage engines
const generalStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsPath = path.join(__dirname, '../uploads');
    cb(null, uploadsPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const roomImagesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/rooms/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type for general uploads
function checkGeneralFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images, PDFs, and Word documents are allowed!');
  }
}

// Check file type for room images
function checkRoomImageFileType(file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

// Initialize general upload
const generalUpload = multer({
  storage: generalStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkGeneralFileType(file, cb);
  }
});

// Initialize room images upload
const roomImagesUpload = multer({
  storage: roomImagesStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkRoomImageFileType(file, cb);
  }
});

const uploadMiddleware = generalUpload;

uploadMiddleware.uploadSingle = generalUpload.single('file');
uploadMiddleware.uploadMultiple = generalUpload.array('files', 10);
uploadMiddleware.uploadRoomImages = roomImagesUpload.array('images', 5);

module.exports = uploadMiddleware;