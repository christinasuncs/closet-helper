require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // for images
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Image = require('./models/Image');
const Outfit = require('./models/Outfit');

const app = express()

// Middleware
app.use(express.json());
app.use(cors())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

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

// fetch all images
app.get("/images", async(req, res) => {
  try {
    const images = await Image.find({})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})

// fetch all outfits
app.get("/outfits", async(req, res) => {
  try {
    const outfits = await Outfit.find({})
    .populate('hat')
    .populate('top')
    .populate('bottom')
    .populate('shoes')
    .populate('accessory')
    res.json(outfits)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch outfits"})
  }
})

// make/save a new outfit
app.post("/outfits/new", async (req, res) => {
  try {
      const outfit = new Outfit(req.body); // pass is body to model
      await outfit.save(); // save it
      res.json(outfit); // output new saved outfit
  } catch (err) {
      res.status(500).json
  }
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));