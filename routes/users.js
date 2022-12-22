const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Update User
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been Updated.")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You do not have permission.");
    }
});
//Delete User
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully.")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        res.status(403).json("You do not have permission.");
    }
});
//Get a User
//Follow User
//Unfollow User

module.exports = router