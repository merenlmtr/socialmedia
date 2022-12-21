const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Hey its users route");
})

module.exports = router