const fs = require('fs');
//const httpServer = require('http');
const fileFormat = require('./model/EFileFormats');
const DocumentCtrl = require('./controller/DocumentCtrl');
//const Generator = require('./services/ImageGeneration/SVGGenerator');
const ComicGenerator = require('./services/ImageGeneration/ComicGenerator');
//const IOWriter = require('./services/SequenceDiskWriter');

let rawDocument = fs.readFileSync('./resources/sensing_example.json', { encoding: 'utf8' });
//let rawDocument = fs.readFileSync('./resources/117824.json', { encoding: 'utf8' });
//let doc = DocumentCtrl.parseProvDocument(rawDocument, fileFormat.JSON);
//console.log(doc.toString());

/*DocumentCtrl.parseProvDocument(rawDocument, fileFormat.JSON).then(doc => {
    //console.log(doc.activities[0]);
    //console.log(doc.agents);
    return ComicGenerator.createComic(doc, 500);
}).then(comic => {
    fs.writeFileSync('comic.svg', comic.data);
}).catch(ex => console.error(ex));*/

const config = require('./config/config');
const axios = require('axios');

axios.get(config.STORE_URL + 'documents/10.json', { responseType: 'json' }).then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});