const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const AWS = require('aws-sdk');

//Express setup
app.use(bodyParser.json({ strict: false }));
//app.use(express.compress());

//Services
const DocumentCtrl = require('./controller/DocumentCtrl');
const ComicGenerator = require('./services/ImageGeneration/ComicGenerator');

// Controller
const ComicCtrl = require('./controller/ComicApi')(DocumentCtrl, ComicGenerator);
app.use('/api/v1/comic', ComicCtrl);

module.exports.handler = serverless(app);