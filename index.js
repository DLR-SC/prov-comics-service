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
const DocCtrl = require('./controller/ConverterApi')(DocumentCtrl, ComicGenerator);
app.use('/api/v1/comic', ComicCtrl);
app.use('/api/v1/doc', DocCtrl);

app.listen(3000, () => {
  console.log("Comic Service started on port 3000!");
});
