const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const index = file.fieldname.split('-')[1];
    const eventId = req.body.eventId;
    const registrationNumber = req.body.participants[`registerNumber-${index}`];
    if (!eventId || !registrationNumber) {
      return cb(new Error("Missing event ID or registration number"));
    }

    const filename = `${eventId}-${registrationNumber}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'), false);
  }
};

// Upload config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB limit
  }
});

module.exports = upload;
