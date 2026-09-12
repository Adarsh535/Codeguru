import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Checks if Cloudinary credentials are present in environment
 * @returns {boolean}
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Verifies Cloudinary API connection by pinging the service
 * @returns {Promise<{ configured: boolean, connected: boolean, cloudName: string, error?: string }>}
 */
export const checkCloudinaryConnection = async () => {
  if (!isCloudinaryConfigured()) {
    return {
      configured: false,
      connected: false,
      cloudName: null,
      message: 'Cloudinary environment variables missing'
    };
  }

  try {
    const result = await cloudinary.api.ping();
    return {
      configured: true,
      connected: result.status === 'ok',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      message: 'Cloudinary connected successfully'
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      error: error.message,
      message: 'Failed to connect to Cloudinary API'
    };
  }
};

export default cloudinary;

