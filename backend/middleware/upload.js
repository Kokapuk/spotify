import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    cb(null, req.trackId + extension);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'audio/mpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 15,
  },
});

export const generateTrackId = (req, _res, next) => {
  req.trackId = new mongoose.Types.ObjectId();
  next();
};

export default upload;
