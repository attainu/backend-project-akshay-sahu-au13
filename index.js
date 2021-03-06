const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {userRoutes, loggedUsers} = require('./routes/user');
const blogRoutes = require('./routes/blogs');
const MongoInit = require('./config/mongodb');
const layout = path.join('layouts', "index");
const cookie = require( 'cookie-parser' );
const PORT = process.env.PORT || 5102;
const hbs = require('hbs');
const partialPath = path.join(__dirname,'../views/partials');
const multer = require('multer');

// Connecting to MongoDB database
MongoInit();

// Starting express app
const app = express();
// cookie-parser
app.use( cookie() );
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routers
app.use('/auth', userRoutes);
app.use('/auth/profile', blogRoutes);

// setting path for static files
app.use(express.static(path.join(__dirname,'public')));

// Setting up view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));

// hbs.registerPartial(partials,partialPath);

// Setting storage engine
const Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

// Init file upload

let upload = multer({
    storage: Storage,
}).single('dp');

app.get('/', (req, res)=> {
    console.log(loggedUsers)
    res.render('home', {title: " BlogginBow home", layout});
});



app.listen(PORT, ()=> {
    console.log(`Listening to http://localhost:${PORT}`);
})

