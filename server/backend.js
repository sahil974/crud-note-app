const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000;
const validator = require('validator')
app.use(express.json())
app.use(cors())

const collection = require('./mongo');

app.post("/", async (req, res) => {
    const user = req.body;
    // console.log(user);

    try {
        const check1 = await collection.findOne({ email: user.email });
        if (check1) {
            if (check1.password === user.password) {
                res.send(check1);
            } else {
                res.send("wrongpassword");
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
            const added = await collection.insertMany([user]);
            // console.log(added);
            res.send(added[0]);
        }
    } catch (err) {
        // console.log(err);
        res.status(500).send("Error");
    }
});


app.post("/note", async (req, res) => {
    // console.log(req.body)
    const { email, newItem } = req.body

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
        // console.log(err);
        res.status(500).send("Error")
    }

})

app.post("/notes", async (req, res) => {

    const email = req.body.email
    // console.log("email from frontend " + email)
    try {
        const doc = await collection.findOne({ email: email })
        // console.log(email)
        // console.log(doc.notes)
        res.send(doc.notes)
    } catch (err) {
        // console.log(err)
    }
})

app.post("/note/delete", async (req, res) => {
    const { id, email } = req.body
    try {
        const doc = await collection.findOne({ email: email })
        // console.log("before delete " + doc.notes)
        doc.notes.splice(id, 1)
        // console.log("after delete " + doc.notes)
        doc.save()

        res.send("deleted")
    } catch (err) {
        console.log(err)
        // res.send("err")
    }
})

app.post("/update", async (req, res) => {
    const { id, email, updatedText } = req.body

    try {
        const doc = await collection.findOne({ email: email })

        doc.notes[id] = updatedText
        doc.save()
        // console.log("updated")
        res.send("updated")
    } catch (err) {
        // console.log("error while updating : " + err)

    }
})


app.listen(port, () => {
    console.log('Listening to port ' + port)
})