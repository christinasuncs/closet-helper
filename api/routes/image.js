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

// fetch all images with null account_id
router.get("/", async(req, res) => {
  try {
    const images = await Image.find({account_id: null})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})

// fetch images by account_id, always use if user is logged in
router.get("/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const image = await Image.find({account_id: id});
    // if (!image) {
    //   return res.status(200).json({ message: "No images in account" });
    // }
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// POST upload image
router.post("/upload", upload.array('images'), async (req, res) => {
  try {
    // const imageUrl = req.file.path; // URL of the uploaded image in Cloudinary
    const { type, account_id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename, // Store the public ID for future reference (e.g., for deletion)
      type: type,
      account_id: account_id != "" ? account_id : null, // Use null if no account_id is provided
    }));

    const savedImages = await Image.insertMany(images); // Save the images to the database

    res.status(201).json({ message: "Image(s) uploaded successfully", image: savedImages});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image(s) upload failed" });
  }
});

router.put("/archive/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const updatedImage = await Image.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(updatedImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update image" });
  }
})

module.exports = router;