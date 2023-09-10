// jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const connectDB = require('./db/connect');

const books = require('./routes/routes')
const authRouter = require('./routes/auth')
app.use('/books', books)
app.use('/auth' , authRouter)

mongoose.connect("mongodb+srv://mayank:mayank@cluster0.fy2cjib.mongodb.net/book-collection?retryWrites=true&w=majority").then(() => {
    console.log('App connected to database');
    app.listen(3000, function () {
        console.log("server started");
    });
})
    .catch((error) => {
        console.log(error);
    });

// const port = process.env.PORT || 3000;
// const start = async () => {
//     try {
//         await connectDB(process.env.MONGO_URI);
//         app.listen(port, () =>
//             console.log(`Server is listening on port ${port}...`)
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };
// start();