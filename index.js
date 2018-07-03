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
const DocCtrl = require('./controller/ConverterApi')(DocumentCtrl, ComicGenerator);
app.use('/api/v1/comic', ComicCtrl);
app.use('/api/v1/doc', DocCtrl);

module.exports.handler = serverless(app);