const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

// Using mongodb compass
const compass = 'mongodb://localhost:27017/crud-test'

// Using Mongo DB atlas
const atlas = process.env.DATABASE_URI

mongoose.connect(atlas, { family: 4 })
    .then(() => { console.log('connected to Database') })
    .catch((err) => { console.log('Opps cant connect to Database ' + err) })


const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    cpassword: { type: String },
    notes: [String],


})

// hashing

schema.pre('save', async function (next) {

    if (this.isModified('password')) {
        console.log("inside")
        this.password = await bcrypt.hash(this.password, 4)
        // this.cpassword = await bcrypt.hash(this.cpassword, 4)
        this.cpassword = undefined
    }
    next()
})

// Token Generation

schema.methods.generateAuthToken = function () {
    const genToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: "7d" })

    return genToken
}



const collection = mongoose.model('notesLogincollection', schema)

module.exports = collection

