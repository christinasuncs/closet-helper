const express = require('express');
const router = express.Router();
const Image = require("../models/Image.js");
const cloudinary = require('cloudinary').v2;
const multer = require('multer'); // for images
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const base_folder = 'outfit_pieces'; // base folder for images

// Multer and Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: `${base_folder}`,
      allowed_formats: ['jpg', 'png'],
    };
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

// POST upload image
router.post("/upload", upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // URL of the uploaded image in Cloudinary
    const { type } = req.body;

    const newImage = new Image({
      url: imageUrl,
      public_id: req.file.filename, // Store the public ID for future reference (e.g., for deletion)
      type: type,
    });

    await newImage.save();

    res.status(201).json({ message: "Image uploaded successfully", image: newImage});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});
module.exports = router;