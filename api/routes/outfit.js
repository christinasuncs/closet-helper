const express = require('express');
const router = express.Router();
const Outfit = require("../models/Outfit.js");


// fetch all outfits
router.get("/", async(req, res) => {
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
router.post("/new", async (req, res) => {
  try {
      const outfit = new Outfit(req.body); // pass in body to model
      await outfit.save(); // save it
      res.json(outfit); // output new saved outfit
  } catch (err) {
      res.status(500).json
  }
})

// get one outfit
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const outfit = await Outfit.findById(id);
    res.json(outfit);
} catch (err) {
    res.status(500).json({ error: err.message });
}
})

// delete outfit
router.delete("/delete/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const deleteOutfit = await Outfit.findByIdAndDelete(id);
    if (!deleteOutfit) {
      return res.status(404).json({message: "Outfit not found"});
    }
    res.json({message: "Outfit deleted successfully."});
  } catch (err) {
    res.status(500).json
  }
})

// edit outfit
router.put("/edit/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const outfitChanges = req.body
    const editedOutfit = await Outfit.findByIdAndUpdate(id, outfitChanges, {new: true})
    if (!editedOutfit) {
      return res.status(404).json({message: "Outfit not found"})
    }
    res.json(editedOutfit)
  } catch (err) {
    res.status(500).json({error: err.message})
  }
})

module.exports = router;