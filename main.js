const fs = require('fs');
const fileFormat = require('./model/EFileFormats');
const DocumentCtrl = require('./controller/DocumentCtrl');

let rawDocument = fs.readFileSync('./resources/input_example.json', { encoding: 'utf8' });
let doc = DocumentCtrl.parseProvDocument(rawDocument, fileFormat.JSON);

console.log(doc.toString());

