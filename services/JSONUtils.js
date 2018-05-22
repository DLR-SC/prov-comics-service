const ProvAttr = require('../model/EComponents').ProvAttributes;
class JSONUtils {
    constructor() {}

    /**
     * A function that returns the actual key given a search keyword,
     * if nothing matches null is returned.
     * @param {*String or part of string that should be in the JSON object} keyword 
     */
    static findKeyInObj(keyword, obj) {
        for(let key in obj) {
            let regex = new RegExp(keyword, 'i');
            if(key.match(regex)) return key;
        }
        return null;
    }

    static resolveQualifiedNames(element, parent, parentKey) {
        for(let key in element) {
            if (typeof element[key] == 'object' && element[key]) {
                this.resolveQualifiedNames(element[key], element, key);
            } else if(element[key] == ProvAttr.QUALIFIED_NAME){
                parent[parentKey] = element['$'];
                break;
            } else {
                continue;
            }

        }
    }

    static orderDocumentByTime(document) {
        return document;
    }

    static isEnumValue(enumObj, value) {
        for (const key in enumObj) {
            if (!enumObj.hasOwnProperty(key))
                continue;
            if(enumObj[key] == value)
                return true;
        }
        return false;
    }
}

module.exports = JSONUtils;