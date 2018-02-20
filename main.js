const fs = require('fs');
const httpServer = require('http');
const fileFormat = require('./model/EFileFormats');
const DocumentCtrl = require('./controller/DocumentCtrl');
const Generator = require('./services/ImageGeneration/IntroGenerator');

let rawDocument = fs.readFileSync('./resources/input_example.json', { encoding: 'utf8' });
let doc = DocumentCtrl.parseProvDocument(rawDocument, fileFormat.JSON);
//console.log(doc.toString());

let builder = new Generator(doc.activities[0]);
builder.generate();
//console.log(builder.toString());

httpServer.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.end(builder.toString(), 'utf-8');

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

