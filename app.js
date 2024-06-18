const express = require('express');
const connectDB = require("./config/db")
const bodyParser = require('body-parser');
const libraryRoutes = require('./routes/library');

const app = express();
const PORT = process.env.PORT

require('dotenv').config();
connectDB();




//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.listen(PORT, () => {
    console.log(`Node API is running on port ${PORT}`)
})
