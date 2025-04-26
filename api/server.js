require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Image = require('./models/Image');
const cloudinary = require('cloudinary').v2;

const database = require('./utils/database');
const outfit_routes = require("./routes/outfit.js");
const image_routes = require('./routes/image.js');
const tag_routes = require('./routes/tag.js');

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

app.use("/api/outfit", outfit_routes);
app.use('/api/images', image_routes)
app.use('/api/tags', tag_routes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  database.connect()
  console.log(`Server started on port ${PORT}`)
});