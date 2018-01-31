const AParser = require('./AParser');
const Document = require('./Document');

class XMLParser extends AParser{
    static parse(rawDocument) {
        return new Document();
    }
}

module.exports = XMLParser;
