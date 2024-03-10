const express = require('express');
const app = express();
require('./Config/db')();
require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middlewares/responseHandler');
const { vonage, Vonages } = require('./Utils/vonage');
const user_Router = require('./routes/userRoutes');
const officialRoutes = require('./routes/officialRoutes')



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:4100",
    credentials:true
}));
app.use(require('morgan')('dev'))

app.use('/', user_Router)
app.use('/officials', officialRoutes)


app.use(errorHandler)

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // console.log(process.env.privateKey);
});
