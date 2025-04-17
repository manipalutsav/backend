const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Require fs for directory check

/**
 * Multer disk storage configuration.
 * Defines how uploaded files are stored.
 */
const storage = multer.diskStorage({
  /**
   * Sets the destination directory for uploaded files.
   * @param {object} req - The request object.
   * @param {object} file - The file object.
   * @param {function} cb - The callback function.
   */
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    // Ensure the upload directory exists
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },

  /**
   * Generates a unique filename for the uploaded file.
   * Filename format: eventId-registrationNumber-fieldname.ext (CHANGED)
   * @param {object} req - The request object.
   * @param {object} file - The file object.
   * @param {function} cb - The callback function.
   */
  filename: function (req, file, cb) {
    try {
      // Get the file extension
      const ext = path.extname(file.originalname);
      // Extract the index from the fieldname (e.g., 'panPhoto-0' -> '0')
      const fieldnameParts = file.fieldname.split('-');
      const index = fieldnameParts[fieldnameParts.length - 1]; // Get last part as index

      // Validate index
      if (index === undefined || isNaN(parseInt(index))) {
         return cb(new Error(`Invalid file fieldname format: ${file.fieldname}. Expected format like 'fieldName-index'.`));
      }
      const participantIndex = parseInt(index);

      // Get eventId from the request body
      const eventId = req.body.eventId;

      // --- Access Participants Data ---
      // NOTE: Accessing req.body here can be fragile with upload.any() as
      // body might not be fully parsed when this runs for the *first* file.
      // It seems to work in your case, but consider alternatives if issues arise.
      let participants;
      try {
          // Assume participants is sent as a JSON string
          participants = JSON.parse(req.body.participants);
          if (!Array.isArray(participants)) throw new Error("Not an array");
      } catch (parseError) {
          console.error("Multer filename function failed to parse req.body.participants:", parseError);
          // Cannot reliably get regNumber, use a fallback naming scheme
          const fallbackFilename = `${Date.now()}-${file.fieldname}${ext}`;
          console.warn(`Using fallback filename: ${fallbackFilename}`);
          return cb(null, fallbackFilename);
          // Or return an error: return cb(new Error("Could not parse participants data to generate filename"));
      }

      // --- Input Validation ---
      if (!eventId) {
        // Use fallback if eventId is missing
        const fallbackFilename = `${Date.now()}-${file.fieldname}${ext}`;
        console.warn(`Missing eventId, using fallback filename: ${fallbackFilename}`);
        return cb(null, fallbackFilename);
        // return cb(new Error("Missing event ID in request body"));
      }

      if (participantIndex >= participants.length || participantIndex < 0) {
          return cb(new Error(`Participant index ${participantIndex} is out of bounds (Array length: ${participants.length})`));
      }

      // Get the specific participant object using the index
      const participant = participants[participantIndex];

      if (!participant || typeof participant !== 'object') {
         return cb(new Error(`Invalid participant data found at index ${participantIndex}`));
      }

      // Get the registration number from the participant object
      const registrationNumber = participant.regNumber;

      if (!registrationNumber) {
        return cb(new Error(`Missing registration number for participant at index ${participantIndex}`));
      }

      // --- Construct the filename (ADDED fieldname for uniqueness) ---
      // Format: eventId-regNumber-fieldname.ext
      // Example: 67cb...-240970053-panPhoto-0.png
      const uniqueFilename = `${eventId}-${registrationNumber}-${file.fieldname}${ext}`;

      console.log(`Generated filename for ${file.originalname}: ${uniqueFilename}`); // Log generated name
      cb(null, uniqueFilename);

    } catch (error) {
       // Catch any unexpected errors during filename generation
       console.error("Unexpected error in multer filename function:", error);
       cb(error); // Pass error to multer
    }
  }
});

/**
 * File filter function to allow only specific file types.
 * @param {object} req - The request object.
 * @param {object} file - The file object.
 * @param {function} cb - The callback function.
 */
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  console.log(`Filtering file: ${file.originalname}, MIME type: ${file.mimetype}`); // Log file info

  // Check if the file's MIME type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    console.log(`Allowing file: ${file.originalname}`);
    cb(null, true); // Accept the file
  } else {
    console.error(`Rejecting file (invalid type): ${file.originalname}`); // Log rejection
    // Reject the file silently (won't appear in req.files, won't throw error)
    cb(null, false);
    // Alternatively, reject with an error:
    // cb(new Error('Invalid file type. Only images (JPEG, PNG) and PDFs are allowed'), false);
  }
};

/**
 * Multer upload configuration.
 * Combines storage, file filter, and size limits.
 */
const upload = multer({
  storage: storage, // Use the defined disk storage
  fileFilter: fileFilter, // Use the defined file filter
  limits: {
    fileSize: 2 * 1024 * 1024 // Set file size limit to 2 MB
  }
});

// Export the configured multer instance
module.exports = upload;
