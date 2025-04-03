const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const saleRoutes = require('./routes/salesRoutes');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');
const { upload } = require('./middleware/fileUpload');
const Sale = require('./models/sale'); 


const app = express();
let port = 3000;
let host = 'localhost';

const mongUri = 'mongodb+srv://stezzo:Simone1029@cluster0.y23t7.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0'

app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(mongUri)
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port)
    });
})
.catch(err => console.log(err.message));

//middleware

app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://stezzo:Simone1029@cluster0.y23t7.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.json()); // JSON parser should be set before routes


//set up routes

app.use('/', saleRoutes);
app.use('/users', userRoutes);
app.use('/items', offerRoutes);



// 404 error handling for undefined routes
app.use((req, res, next) => {
    const err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log stack trace for debugging
    res.status(err.status || 500); // Set status code
    res.render('error', { error: err }); // Render error page with error details
});




