import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { photoController } from '../controllers/photo.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Memory storage for processing with Sharp directly
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP allowed.'));
    }
  }
});

router.use(authenticateToken); // Protect all photo routes

// Endpoints
router.post('/upload', upload.single('photo'), asyncHandler(photoController.uploadPhoto));
router.get('/', asyncHandler(photoController.getPhotos));
router.delete('/:id', asyncHandler(photoController.deletePhoto));
router.patch('/primary', asyncHandler(photoController.setPrimary));
router.get('/verification', asyncHandler(photoController.getVerification));
router.get('/trust-score', asyncHandler(photoController.getTrustScore));

// For backward compatibility if frontend uses `/api/photos` without `/upload` to POST
router.post('/', upload.single('photo'), asyncHandler(photoController.uploadPhoto));

export default router;
