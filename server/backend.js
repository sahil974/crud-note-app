const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000;
app.use(express.json())
app.use(cors())

const loginRoute = require("./routes/login")
const signupRoute = require("./routes/signup")
const noteRoute = require("./routes/note")


app.use("/", loginRoute)
app.use("/signup", signupRoute)
app.use("/note", noteRoute)



app.listen(port, () => {
    console.log('Listening to port ' + port)
})