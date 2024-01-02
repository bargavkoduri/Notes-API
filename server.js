const express = require("express")
const app = express()
const cors = require("cors")
const { connectDB} = require("./utils/db")
const {PORT} = require("./constants")

const notesRouter = require("./routes/notes.router")
const loginRouter = require("./routes/login.router")

app.use(cors())
app.use(express.json())

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT : ${PORT} `);
    });
})
.catch(() => {
    console.log("Unable to connect to db")
})

app.use("/notes",notesRouter)
app.use("/login",loginRouter)

module.exports = app