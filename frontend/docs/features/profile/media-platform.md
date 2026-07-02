# Media Platform Documentation

## Overview
The Media Platform is responsible for handling user uploads, image/video processing, optimization, and delivery across the application.

## Architecture
- **Storage:** Integration with cloud storage (e.g., AWS S3, Cloudinary).
- **Processing:** Frontend image compression and cropping before upload.
- **Delivery:** CDN-backed image delivery with responsive resolutions (`srcset`).

## Key Components
- `MediaUploader`: Drag-and-drop interface with progress indicators.
- `ImageCropper`: Client-side cropping tool.
- `GallerySlider`: Swipeable carousel for viewing profile media.

## API Interfaces
- `POST /api/v1/media/upload`
- `DELETE /api/v1/media/:id`
- `PUT /api/v1/media/reorder`
