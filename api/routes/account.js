const express = require('express');
const router = express.Router();
const Account = require("../models/Account.js");
const bcrypt = require('bcrypt');

// create new account/register
router.post("/register", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    try {
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new Account({ username, password: hashedPassword });
        await newAccount.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }    
})

// login 
router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    try {
        const account = await Account.findOne({ username});
        if (!account) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const valid = await bcrypt.compare(password, account.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        req.session.user = {
            id: account._id,
            username: account.username
        };
        res.json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
);

// check session endpoint
router.get("/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// logout endpoint
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json({ message: "Logout successful" });
    });
});

module.exports = router;