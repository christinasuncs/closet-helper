require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // for images
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Image = require('./models/Image');

const database = require('./utils/database');
const outfit_routes = require("./routes/outfit.js");

const app = express()

// Middleware
app.use(express.json());
app.use(cors())

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer and Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'outfit_generator',
    allowedFormats: ['jpg', 'png'],
  },
});


app.use("/api/outfit", outfit_routes);

// fetch all images
app.get("/images", async(req, res) => {
  try {
    const images = await Image.find({})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  database.connect()
  console.log(`Server started on port ${PORT}`)
});