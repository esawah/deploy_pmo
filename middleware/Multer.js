import multer from 'multer';
import crypto from 'crypto';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate file type
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed!'), false);
  } else {
    cb(null, true);
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024, 
};

const validateImage = multer({ storage, fileFilter, limits });

export default validateImage;
