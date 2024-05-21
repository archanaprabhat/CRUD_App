require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT =  process.env.PORT || 4000;

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to the database.'));

//middlewares

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',   // a secret string used to sign the session ID cookie
    saveUninitialized: true,    // create session when something stored
    resave: false,   // don't save session if unmodified
}))

app.use((req, res, next) => {
    res.locals.message =  req.session.message;
    delete req.session.message;
    next();
})

//set template engine

app.set('view engine', 'ejs');

//route prefix
app.use("", require('./routes/routes'))


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
