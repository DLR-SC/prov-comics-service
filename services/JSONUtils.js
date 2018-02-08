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
}

module.exports = JSONUtils;