const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 8000;
const validator = require('validator')
app.use(express.json())
app.use(cors())

const collection = require('./mongo');

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



app.get('/note', verifyToken, async (req, res) => {
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

app.post("/", async (req, res) => {
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
});

app.post("/signup", async (req, res) => {
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
});


app.post("/note/:email", async (req, res) => {
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

// app.get("/note/:email", async (req, res) => {

//     const email = req.params.email
//     // console.log("email from frontend " + email)
//     try {
//         const doc = await collection.findOne({ email: email })
//         // console.log(email)
//         // console.log(doc.notes)
//         res.send(doc.notes)
//     } catch (err) {
//         console.log("error while note get : " + err)
//     }
// })

app.delete("/note/:email/:id", async (req, res) => {
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

app.patch("/note/:email", async (req, res) => {
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


app.listen(port, () => {
    console.log('Listening to port ' + port)
})