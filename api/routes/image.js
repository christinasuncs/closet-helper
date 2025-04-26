const express = require('express');
const router = express.Router();
const Image = require("../models/Image.js");
const cloudinary = require('cloudinary').v2;
const multer = require('multer'); // for images
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Multer and Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'outfit_pieces',
    allowedFormats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

// fetch all images
router.get("/", async(req, res) => {
  try {
    console.log(storage)
    const images = await Image.find({})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})

// upload to cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // URL of the uploaded image in Cloudinary

    // Create a new image document in the database
    const newImage = new Image({
      url: imageUrl,
      public_id: req.file.filename, // Store the public ID for future reference (e.g., for deletion)
      type: "top"
    });

    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});



module.exports = router;