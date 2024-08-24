const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.js");

// fetch all tags
router.get("/", async(req, res) => {
  try {
    const tags = await Tag.find({})
    res.json(tags)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags"})
  }
})

// create new tag
router.post("/new", async(req, res) => {
    try {
      const tag = new Tag(req.body); // pass in body to model
      await tag.save(); // save it
      res.json(tag); // output new saved outfit
    } catch (err) {
        res.status(500).json
    }
})

module.exports = router;