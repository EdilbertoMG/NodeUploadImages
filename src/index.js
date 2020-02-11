const express = require('express');
const path = require('path');
const multer  = require('multer');
const uuid  = require('uuid/v4');

// initializations
const app = express();

// sellings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewear
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname)
        .toLocaleLowerCase());
    }
});

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fileSize: 2000000},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (minetype && extname) {
            return cb(null, true);
        }else{
            cb("Error: Archivo debe ser una imagen");
        }
    }
}).single('image'));

// routes
app.use(require('./routes/index'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
