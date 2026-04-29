import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    configureCloudinary();

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'zenth',
      resource_type: 'image',
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    next(err);
  }
};

export const uploadHeroImages = async (req, res, next) => {
  try {
    const files = req.files;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const view = String(req.query.view || '').toLowerCase();
    const folder =
      view === 'mobile'
        ? 'zenth/hero/mobile'
        : view === 'desktop'
          ? 'zenth/hero/desktop'
          : 'zenth/hero';

    configureCloudinary();

    const uploads = await Promise.all(
      files.map(async (f) => {
        const result = await uploadBufferToCloudinary(f.buffer, {
          folder,
          resource_type: 'image',
        });
        return { url: result.secure_url, publicId: result.public_id };
      })
    );

    res.json({ items: uploads });
  } catch (err) {
    next(err);
  }
};
