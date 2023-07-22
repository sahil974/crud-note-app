const express = require('express')
const bcrypt = require('bcryptjs')
const collection = require('../mongo');
const router = express.Router()



router.post("/", async (req, res) => {
    const { email, password } = req.body;
    // console.log(user);

    try {
        const doc = await collection.findOne({ email: email })

        if (doc) {
            //hashing check
            const isMatch = await bcrypt.compare(password, doc.password)


            if (!isMatch)
                res.send("wrongpassword");
            else {

                // authentication
                const token = await doc.generateAuthToken()
                // console.log(token)

                // res.send({ data: token, message: "login" })
                res.send(token)

            }

        } else {
            // console.log("email does not exist in backend");
            res.send("notexist");
        }
    } catch (err) {
        console.log("error while login post" + err);
        res.status(500).send("Error");
    }
})


module.exports = router

