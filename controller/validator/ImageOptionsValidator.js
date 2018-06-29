const ConvOpt = require('../EConversionOptions');
const Formats = require('../EResFileFormats');
const utils = require('../../services/JSONUtils');
class ImageOptionsValidator {
    constructor() {        
        throw new Error('Static class, should not be initialized');
    }

    static validate(name, mode, format, activity) {
        console.log('Validation: ' + name + ', ' + mode + ', ' + format + ', ' + activity);
        if(!name || typeof(name) != 'string') {
            return Promise.reject('Invalid parameters, name');
        } else if(!mode || !utils.isEnumValue(ConvOpt, mode)) {
            return Promise.reject('Invalid parameters, mode');
        } else if(!format || !this.isValidFormat(format)) {
            return Promise.reject('Invalid parameters, format');
        }
        let act = parseInt(activity, 10);
        if(isNaN(act)) act = 0; 

        let parameter = { name: name, mode: mode, imageType: this.getType(format), frameSize: this.getSize(format), activity: act };
        return Promise.resolve(parameter);
    }

    static isValidFormat(format) {
        let parts = format.split(/\./);
        if(parts.length < 1 || parts.length > 2)
            return false;
        return true;
    }

    static getType(format) {
        let parts = format.split(/\./);
        let imageType = 'svg';
        if(parts[0] == 'zip')
            return imageType;
        //if(utils.isEnumValue(Formats, parts[0]))
        //    return parts[0];
        return imageType;
    }

    static getSize(format) {
        let parts = format.split(/\./);
        let size = 500;
        if(parts.length < 2)
            return size;
        try {
            size = parseInt(parts[1]);
        } catch(e) {
            return size;
        }
        return size;
    }
}

module.exports = ImageOptionsValidator;