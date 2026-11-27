const { v2: cloudinary } = require('cloudinary');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads an in-memory image buffer to Cloudinary.
 */
function uploadImageBuffer(buffer, folder = 'lost-found-items') {
  if (!isCloudinaryConfigured) {
    return Promise.reject(new Error('Cloudinary is not configured on the server'));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Removes an image asset from Cloudinary by public ID.
 */
async function deleteCloudinaryImage(publicId) {
  if (!isCloudinaryConfigured || !publicId) {
    return;
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadImageBuffer,
  deleteCloudinaryImage,
};
