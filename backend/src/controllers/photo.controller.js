import { photoService } from '../services/photo.service.js';
import { ValidationError } from '../utils/errors.js';

export const photoController = {
  async uploadPhoto(req, res) {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }
    
    // File validation already handled partially by Multer, but double check
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(req.file.mimetype)) {
      throw new ValidationError('Invalid file type. Only JPEG, PNG, WEBP allowed.');
    }

    const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;

    const photo = await photoService.uploadPhoto(
      req.userId,
      req.file.buffer,
      req.file.mimetype,
      isPrimary
    );

    res.status(201).json(photo);
  },

  async getPhotos(req, res) {
    const photos = await photoService.getPhotos(req.userId);
    res.json(photos);
  },

  async deletePhoto(req, res) {
    await photoService.deletePhoto(req.userId, req.params.id);
    res.json({ message: 'Photo deleted successfully' });
  },

  async setPrimary(req, res) {
    const { photoId } = req.body;
    if (!photoId) throw new ValidationError('photoId is required');

    const updated = await photoService.setPrimaryPhoto(req.userId, photoId);
    res.json({ message: 'Primary photo updated', photo: updated });
  },

  async getVerification(req, res) {
    const verification = await photoService.getVerificationStatus(req.userId);
    res.json(verification || { message: 'No primary photo or verification found' });
  },

  async getTrustScore(req, res) {
    const verification = await photoService.getVerificationStatus(req.userId);
    if (!verification) {
      return res.json({ trustScore: 0, status: 'unknown' });
    }
    res.json({ trustScore: verification.trustScore, status: verification.status });
  }
};
