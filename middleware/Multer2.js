import multer from 'multer';
import crypto from 'crypto';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate file type
  if (!file.mimetype.startsWith('application/pdf')) {
    cb(new Error('Only image files are allowed!'), false);
  } else {
    cb(null, true);
  }
};

const limits = {
  fileSize: 20 * 1024 * 1024, 
};

const validatePDF = multer({ storage, fileFilter, limits });

export default validatePDF;
