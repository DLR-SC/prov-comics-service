const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';
//const AWS = require('aws-sdk');

//Express setup
app.use(bodyParser.json({ strict: false }));
//app.use(express.compress());

//Services
const DocumentCtrl = require('./controller/DocumentCtrl');
const ComicGenerator = require('./services/ImageGeneration/ComicGenerator');

// Controller
const ComicCtrl = require('./controller/ComicApi')(DocumentCtrl, ComicGenerator);
const TransformationCtrl = require('./controller/TransformationApi')(DocumentCtrl, ComicGenerator);
app.use('/api/v1/comic', ComicCtrl);
app.use('/api/v1/transformation', TransformationCtrl);

module.exports.handler = serverless(app);