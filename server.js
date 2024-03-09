const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./Config/db');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middlewares/responseHandler');
const { vonage,Vonages } = require('./Utils/vonage');


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.get('/',(req,res)=>{
   
    res.send("message sended")

})
app.post('/webhooks/inbound', (req, res) => {
    res.send('Hello World!');
});

app.use(errorHandler)

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(process.env.privateKey);
});
