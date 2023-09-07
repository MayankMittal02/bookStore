// jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const app = express();
const books = require('./routes/routes')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use('/books', books)

mongoose.connect("mongodb+srv://mayank:mayank@cluster0.fy2cjib.mongodb.net/book-collection?retryWrites=true&w=majority").then(() => {
    console.log('App connected to database');
    app.listen(3000, function () {
        console.log("server started");
    });
})
    .catch((error) => {
        console.log(error);
    });
