require("dotenv").config();
const express = require("express");
const shortid = require('shortid');
const fs = require('file-system')
const url = require('url')
const multer = require('multer')
const storageOne = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/admin/upload/')

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },



})
const storageTwo = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/upload/')

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },



})
const fileFilter = (req, file, cb) => {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
}

const uploadOne = multer({ storage: storageOne, fileFilter: fileFilter })
const uploadTwo = multer({ storage: storageTwo, fileFilter: fileFilter })

//const fileUpload = require('express-fileupload');
const cors = require("cors");
const path = require('path')
const bodyParser = require("body-parser");
const session = require("express-session");
const { ExpressOIDC } = require("@okta/oidc-middleware");
const app = express();
const Sequelize = require('sequelize')
const epilogue = require('epilogue'),
    ForbiddenError = epilogue.Errors.ForbiddenError;
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
//app.use(fileUpload())
app.use(
    session({
        secret: process.env.RANDOM_SECRET_WORD,
        resave: true,
        saveUninitialized: false
    })
);

const oidc = new ExpressOIDC({
    issuer: 'https://dev-407633.okta.com/oauth2/default',
    appBaseUrl: 'http://localhost:3000',
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/authorization-code/callback',
    //loginRedirectUri: process.env.LOGIN_REDIRECT_URL,
    //logoutRedirectUri: process.env.LOGOUT_REDIRECT_URL,
    scope: 'openid profile',
    routes: {
        loginCallback: {
            path: '/authorization-code/callback',
            afterCallback: '/admin'
        }
    }
});

app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))
    //app.use('/upload', express.static(path.join(__dirname, '/admin/upload')))



app.get('/admin/gallery', oidc.ensureAuthenticated(), (req, res) => {
    res.sendFile(path.join(__dirname, '/public/adminGallery.html'))
})

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/gallery.html'))
})


app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, './public/home.html'))
})



app.get('/admin', oidc.ensureAuthenticated(), (req, res) => {
    res.sendFile(path.join(__dirname, './public/admin/admin.html'))
})


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/home')
})



app.get('/', (req, res) => {
    res.redirect('/home')
        //res.send('hi')
})

const db = new Sequelize({
        dialect: 'sqlite',
        storage: './test.database',

        //operatorsAliases: false,
    })
    /*const Image = db.define('image', {
        file: Sequelize.BLOB
    })*/

const Post = db.define('posts', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    // file: Sequelize.BLOB,
})

epilogue.initialize({ app, sequelize: db })

function upload(req, res, next) {
    uploadOne.single('imgFile')(req, res, next);
    uploadTwo.single('imgFile')(req, res, next);
    next();
}

app.post('/admin/gallery', upload, (req, res) => {
    if (res.status(200)) {
        console.log('upload successfull')
        res.redirect('/admin/gallery')
    }

});



app.delete('/admin/upload/:id', function(req, res) {
    try {
        fs.unlinkSync(`/Users/kohar/Desktop/react-node-blog/public/admin/upload/${req.params.id}`);
        fs.unlinkSync(`/Users/kohar/Desktop/react-node-blog/public/upload/${req.params.id}`);

        res.status(201).send({ message: "Image deleted" });

    } catch (e) {
        res.status(400).send({ message: "Error deleting image!" });
    }
})

/*console.log(req.params.imagePath)
fs.unlink(imgDirectoryOne, function(err) {
    if (err) throw err;

    console.log('file deleted');
});
fs.unlink(imgDirectoryTwo, function(err) {
    if (err) throw err;

    console.log('file deleted');
});*/

/* if (!req.params.imagename) {
     console.log("No file received");
     message = "Error! in image delete.";
     return res.status(500).json('error in delete');

 } else {
     console.log('file received');
     console.log(req.params.imagename);
     try {
         fs.unlinkSync(DIR + '/' + req.params.imagename + '.png');
         console.log('successfully deleted /tmp/hello');
         return res.status(200).send('Successfully! Image has been Deleted');
     } catch (err) {
         // handle the error
         return res.status(400).send(err);
     }

 }*/


/* const DIR = 'uploads';
    app.delete('/api/v1/delete/:imagename',function (req, res) {
      message : "Error! in image upload.";
        if (!req.params.imagename) {
            console.log("No file received");
            message = "Error! in image delete.";
            return res.status(500).json('error in delete');
        
          } else {
            console.log('file received');
            console.log(req.params.imagename);
            try {
                fs.unlinkSync(DIR+'/'+req.params.imagename+'.png');
                console.log('successfully deleted /tmp/hello');
                return res.status(200).send('Successfully! Image has been Deleted');
              } catch (err) {
                // handle the error
                return res.status(400).send(err);
              }
            
          }
     
    });/* 


//Image.create(req.files.imgFile).then(file => console.log(file))
/*app.get('/upload', (req, res) => {
    Image.findAll().then(posts => res.json(posts))
})*/


//get the list of jpg files in the image dir

//const directoryPath = path.join(__dirname, "upload")
//app.delete('/admin/')

app.get('/admin/upload', (req, res) => {


    const imageDir = '/Users/kohar/Desktop/react-node-blog/public/admin/upload/'



    var query = url.parse(req.url, true).query;
    pic = query.image;


    if (typeof pic == 'undefined') {
        var imageLists = []


        getImages(imageDir, function(err, files) {

            for (var i = 0; i < files.length; i++) {
                console.log(files[i])
                const fileSrc = 'upload/' + files[i]
                imageLists.push({
                    src: fileSrc,
                    id: fileSrc
                })
            }
            //  imageLists += '</ul>';
            res.send(imageLists)
            console.log(imageLists)
                //res.writeHead(200, { 'Content-type': 'text/html' });



        })
    } else {
        //read the image using fs and send the image content back in the response
        fs.readFile(imageDir + pic, function(err, content) {
            if (err) {
                res.writeHead(400, { 'Content-type': 'image/jpg' })
                console.log(err);
                res.end("No such image");
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, { 'Content-type': 'image/jpg' });
                // console.log(content)
                //   res.end(content);
            }
        });
    }

    function getImages(imageDir, callback) {
        var fileTypeTwo = '.jpeg'
        var fileTypeThree = '.png'
        var fileType = '.jpg',
            files = [],
            i;
        fs.readdir(imageDir, function(err, list) {
            for (i = 0; i < list.length; i++) {
                if (path.extname(list[i]) === fileType, fileTypeTwo, fileTypeThree) {
                    files.push(list[i]); //store the file name into the array files
                    // console.log(list[i])
                }
            }

            callback(err, files);
        });
    }

})






//  Image.findAll().then(images => res.json(images))
app.post('/posts', (req, res) => {
    Post.create(req.body)
        .then(user => res.json(user))
})

app.get('/posts', (req, res) => {
    Post.findAll().then(posts => res.json(posts))
})


app.get('/posts/:id', (req, res) => {
    Post.findOne({ where: { id: req.params.id } }).then(posts => res.json(posts))
})

app.put('/posts/:id', (req, res) => {
    Post.update({ title: req.body.title, content: req.body.content }, { where: { id: req.params.id } })
});
app.delete('/posts/:id', (req, res) => {
    Post.destroy({ where: { id: req.params.id } })
        .then(function(rowDeleted) {
            if (rowDeleted === 1) {
                console.log('deleted')
            } else(err) => {
                console.log(err)
            }
        })

})


db.sync().then(() => {
    oidc.on('ready', () => {
        app.listen(port, () => console.log('app started'));
    });
});

oidc.on('error', err => {
    console.log('open ID error', err)
})