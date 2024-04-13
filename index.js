if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// Models
const Book = require('./models/Book');
const Member = require('./models/Member');
const Circulation = require('./models/Circulation');


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Routers
const serviceRouter = require('./routers/serviceRouter');


mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Mongoose Connection Open!');
    })
    .catch((err) => {
        console.log('Oh no! Mongoose Connection Error!');
        console.log(err);
    });


// Allowed Origins
const allowedOrigins = [ 'http://localhost:3000' ];


// Configurations
const corsConfig = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new ExpressError(401, 'Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
};


// Creating express application
const app = express();


// Middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/', serviceRouter);


// Error Handling Middlewares
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    console.log('Middleware 1 message: ', statusCode);
    console.log('Middleware 1 message:\n', message);
    next(err);
});

app.use((err, req, res, next) => {
    console.log('Middleware 2:\n', err.name)
    console.log(err);
    next(err);
});


// Start the server
app.listen(8081, () => {
    console.log('Server started at port 8081...');
});