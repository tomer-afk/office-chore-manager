import { v2 as cloudinary } from 'cloudinary';
import env from '../config/environment.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadImage(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'bench-bark',
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
