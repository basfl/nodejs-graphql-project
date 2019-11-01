const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const path = require("path");
const multer = require("multer");
const uuidv4 = require('uuid/v4');
const connection_string = require('./util/decrept');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth=require("./middleware/auth");
const fs = require('fs');

const app = express();

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4())
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        console.log("*************")
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//app.use(bodyParser.urlencoded()); //for form
app.use(bodyParser.json()); //for application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use("/images", express.static(path.join(__dirname, "images")));
// handle CORS issue
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method==="OPTIONS"){
        return res.sendStatus(200);
    }
    next();
})

app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201)
      .json({ message: 'File stored.', filePath: req.file.path });
  });

app.use("/graphql", graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
        if (!err.originalError) {
            return err
        }
        const data = err.originalError.data;
        const message = err.message || "An Error Occured!";
        const code = err.originalError.code | 500;
        return ({
            message: message,
            status: code,
            data: data
        })

    }

}))

app.use((err, req, res, next) => {
    console.log("inside error middleware err-> ", err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data })
})
mongoose.connect(connection_string).then(result => {
    app.listen(8080);

}).catch(err => {
    console.log(err)
})



