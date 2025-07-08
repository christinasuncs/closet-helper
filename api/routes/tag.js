const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.js");

// fetch all tags with null account_id
router.get("/", async(req, res) => {
  try {
    const tags = await Tag.find({account_id: null}); // find all tags with null account_id
    res.json(tags)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags"})
  }
})

// fetch tags by account_id, always use if user is logged in
router.get("/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const tags = await Tag.find({account_id: id}); // find all tags with account_id
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tags" });
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