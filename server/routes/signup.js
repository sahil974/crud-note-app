const express = require('express')
const validator = require('validator')
const collection = require('../mongo');
const router = express.Router()

router.post("/", async (req, res) => {
    const user = req.body;
    const isValidEmail = validator.isEmail(user.email);

    if (!isValidEmail) {
        return res.send("Invalid email address");
    }
    try {
        const check = await collection.findOne({ email: user.email });

        if (check) {
            return res.send("alreadyexist");
        } else {
            // const added = await collection.insertMany([user]);
            // console.log(added);
            // res.send(added[0]);

            const user1 = new collection(user)
            const doc = await user1.save();

            // authentication
            const token = await doc.generateAuthToken()
            // console.log(token)

            res.send(token)

        }
    } catch (err) {
        // console.log(err);
        res.status(500).send("Error");
    }
})

module.exports = router