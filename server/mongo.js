const mongoose = require('mongoose')
require('dotenv').config();

const validator = require('validator')
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
    notes: [String]
})
const collection = mongoose.model('notesLogincollection', schema)

module.exports = collection