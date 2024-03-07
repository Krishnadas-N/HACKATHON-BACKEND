const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./Config/db');
const app = express();
require('dotenv').config();



app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
