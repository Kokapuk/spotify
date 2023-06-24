import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import * as UserController from './controllers/UserController.js';
import * as TrackController from './controllers/TrackController.js';
import { checkAuth, requireAuth } from './middleware/auth.js';
import { handleValidationErrors, signInValidation, signUpValidation, uploadingTrackValidation } from './middleware/validator.js';
import upload, { generateTrackId } from './middleware/upload.js';

dotenv.config();

try {
  await mongoose.connect(process.env.DB_URI);
  console.log('DB Connected');
} catch (err) {
  console.error(err);
  process.exit(err.code);
}

const app = express();

app.use(express.json());
app.use(cors());
app.use('/static', express.static('uploads'));

app.post('/auth/signup', signUpValidation, handleValidationErrors, UserController.signUp);
app.post('/auth/signin', signInValidation, handleValidationErrors, UserController.signIn);
app.get('/auth/me', requireAuth, UserController.getMe);

app.post(
  '/tracks',
  requireAuth,
  uploadingTrackValidation,
  handleValidationErrors,
  generateTrackId,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  TrackController.upload
);
app.get('/tracks', checkAuth, TrackController.findAll);
app.get('/tracks/:id', checkAuth, TrackController.findOne);
app.post('/tracks/:id', requireAuth, TrackController.toggleLike);

app.get('/liked', requireAuth, TrackController.getLiked);
app.get('/liked/amount', requireAuth, TrackController.getLikedAmount);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Listening at port ${process.env.PORT}...`);
});
