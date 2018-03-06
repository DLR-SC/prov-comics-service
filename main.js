const fs = require('fs');
const httpServer = require('http');
const fileFormat = require('./model/EFileFormats');
const DocumentCtrl = require('./controller/DocumentCtrl');
const Generator = require('./services/ImageGeneration/SequenceGenerator');
const ComicGenerator = require('./services/ImageGeneration/ComicGenerator');
const IOWriter = require('./services/SequenceDiskWriter');

let rawDocument = fs.readFileSync('./resources/flow.json', { encoding: 'utf8' });
let doc = DocumentCtrl.parseProvDocument(rawDocument, fileFormat.JSON);
//console.log(doc.toString());

//let seq = Generator.generateRequestSequence(doc.activities[0], 500);
//require('./services/SequenceDiskWriter').writeSequenceToDisk(seq);
//console.log(builder.toString());


ComicGenerator.createComic(doc, 500).then(comic =>  {
    return IOWriter.writeComicToDisk(comic);
}).then(() => {
    console.log('Comic has been written to disk');
}).catch(error => {
    throw new Error(error);
});


httpServer.createServer((request, response) => {
    let index = request.url.substr(1);
    if(index < 0 || index >= seq.length) {
        response.writeHead(500);
        response.end('Invalid index!', 'utf-8');
    }

    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.end(seq.data[index], 'utf-8');

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

