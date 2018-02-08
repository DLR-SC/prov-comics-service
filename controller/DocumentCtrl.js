const fileFormat = require('../model/EFileFormats');
const JSONParser = require('../model/JSONParser');
const XMLParser = require('../model/XMLParser');

function parseProvDocument(rawDocument, format) {
    let document = null;
    
    switch(format) {
    case fileFormat.JSON:
        document = parseJSONProvDocument(rawDocument);
        break;
    case fileFormat.XML:
        document = parseXMLProvDocument(rawDocument);
        break;
    default:
        throw new Error('Unsupported file format');
    }
    return document;
}

function parseJSONProvDocument(rawDocument) {
    return JSONParser.parse(rawDocument);
}

function parseXMLProvDocument(rawDocument) {
    return XMLParser.parse(rawDocument);
}

exports.parseProvDocument = parseProvDocument;