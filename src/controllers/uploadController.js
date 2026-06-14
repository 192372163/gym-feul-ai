const cloudinary = require('../config/cloudinary');

async function uploadProgressPhoto(req, res) {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'image (base64 or URL) is required' });

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: `fitfuel/${req.user.uid}/progress`,
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
}

module.exports = { uploadProgressPhoto };
