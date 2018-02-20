const AParser = require('../model/AParser');
const Document = require('../model/Document');

class XMLParser extends AParser{
    static parse(rawDocument) {
        return new Document();
    }
}

module.exports = XMLParser;
