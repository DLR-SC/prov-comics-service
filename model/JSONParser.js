const AParser = require('./AParser');
const Document = require('./Document');

const parseActivities = Symbol('parseActivities');

class JSONParser extends AParser{

    static parse(rawDocument) {
        let parsedDoc = new Document();
        let rawDocObj = JSON.parse(rawDocument);

        //Parse JSON ProvDocument
        this[parseActivities](rawDocObj, parsedDoc);

        return parsedDoc;
    }

    static [parseActivities](rawObj, doc) {
        for(let element in rawObj) {
            if(element != '')
                continue;
        }
    }
}

module.exports = JSONParser;
