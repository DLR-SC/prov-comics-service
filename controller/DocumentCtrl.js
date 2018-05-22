const fileFormat = require('../model/EFileFormats');
const JSONParser = require('../services/JSONParser');
const XMLParser = require('../services/XMLParser');

function parseProvDocument(rawDocument, format) {
    let document = null;

    try {
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
    } catch (ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve(document);
}

function parseJSONProvDocument(rawDocument) {
    return JSONParser.parse(rawDocument);
}

function parseXMLProvDocument(rawDocument) {
    return XMLParser.parse(rawDocument);
}

exports.parseProvDocument = parseProvDocument;