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
    const images = await Image.find({})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})

// POST upload image
router.post("/upload", upload.array('images'), async (req, res) => {
  try {
    // const imageUrl = req.file.path; // URL of the uploaded image in Cloudinary
    const { type } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename, // Store the public ID for future reference (e.g., for deletion)
      type: type,
    }));

    const savedImages = await Image.insertMany(images); // Save the images to the database

    res.status(201).json({ message: "Image(s) uploaded successfully", image: savedImages});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image(s) upload failed" });
  }
});

module.exports = router;