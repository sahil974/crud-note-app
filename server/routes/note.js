const express = require('express')
const jwt = require('jsonwebtoken')
const collection = require('../mongo');
const router = express.Router();

// Middleware to verify the token in the request headers
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log("Invalid token:", err);
            return res.status(403).send('Invalid token');
        }

        // console.log("Decoded token:", decoded); // Log the decoded payload for debugging

        req.decoded = decoded; // Store the decoded user information in the request object
        next();
    });
};



router.get('/', verifyToken, async (req, res) => {
    try {
        // console.log(req.decoded)
        const userId = req.decoded._id;
        // console.log(userId)
        const doc = await collection.findOne({ _id: userId })

        // console.log(doc)

        res.send(doc)
    } catch (error) {

    }
})


router.post("/:email", async (req, res) => {
    // console.log(req.body)
    const email = req.params.email
    const { newItem } = req.body

    try {
        const doc = await collection.findOne({ email: email })
        doc.notes.push(newItem)
        // console.log(doc.notes)
        const result = await doc.save()

        if (result) {
            // console.log("succesfull added to database, : " + result)
            res.send("added")
        }
        else {
            res.send("notadded")
        }
    } catch (err) {
        console.log("error while note post " + err);
        // res.status(500).send("Error")
    }

})


router.delete("/:email/:id", async (req, res) => {
    const email = req.params.email
    const id = req.params.id
    try {
        const doc = await collection.findOne({ email: email })
        // console.log("before delete " + doc.notes)
        doc.notes.splice(id, 1)
        // console.log("after delete " + doc.notes)
        doc.save()

        res.send("deleted")
    } catch (err) {
        console.log("error while note delete : " + err)
        // res.send("err")
    }
})

router.patch("/:email", async (req, res) => {
    const email = req.params.email
    const { id, updatedText } = req.body

    try {
        const doc = await collection.findOne({ email: email })

        doc.notes[id] = updatedText
        doc.save()
        // console.log("updated")
        res.send(doc.notes)
    } catch (err) {
        console.log("error while note patch : " + err)

    }
})


module.exports = router