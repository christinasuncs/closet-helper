const express = require('express');
const router = express.Router();
const Image = require("../models/Image.js");

// fetch all images
router.get("/", async(req, res) => {
  try {
    const images = await Image.find({})
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images"})
  }
})

module.exports = router;