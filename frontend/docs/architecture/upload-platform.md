# Upload Platform Architecture

## Overview
Handling media uploads (profile pictures, videos) is critical for a dating platform.

## Strategy
We utilize a **Presigned URL** approach for direct-to-cloud uploads to reduce the load on our backend servers.

## Workflow
1. **Request Presigned URL**: The frontend calls the backend API requesting to upload a file, providing the filename and mime-type.
2. **Receive URL**: The backend authenticates the request, generates a secure, time-limited presigned URL (e.g., AWS S3, GCS) and returns it.
3. **Direct Upload**: The frontend performs a `PUT` request with the binary file data directly to the presigned URL.
4. **Confirm Upload**: The frontend notifies the backend that the upload is complete, and the backend processes the asset (thumbnail generation, moderation).

## Image Optimization
- Before requesting an upload URL, the frontend must compress and resize images using a library like `browser-image-compression`.
- This ensures faster upload times and reduces storage costs.

## State Management
Upload progress is managed using Axios `onUploadProgress` callbacks and mapped to local component state (or a Zustand UI store for background uploads).
