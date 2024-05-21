const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single("image")

// Insert a user into the database route

router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            Phone: req.body.phone,
            image: req.file.filename,
        });
        await user.save(); // Save the user asynchronously
        req.session.message = {
            type: 'success',
            message: 'User Added Successfully'
        };
        res.redirect('/');
    } catch (error) {
        res.json({ message: error.message, type: 'danger' }); // Handle any errors
    }
});

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

module.exports = router;
