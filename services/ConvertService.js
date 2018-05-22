const fileFormats = require('../controller/EResFileFormats');
const sharp = require('sharp');

class ConvertService {
    constructor() {
        throw new Error('Static class, should not be initialized');
    }

    static convertSvgString(comic, format) {
        if(format == fileFormats.JPG || format == fileFormats.PNG) {
            let comicBuffer = new Buffer(comic.data);
            return sharp(comicBuffer).toFormat(format).toBuffer();
        } else if(format == fileFormats.SVG) {
            return Promise.resolve(comic.data);
        } else  {
            return Promise.reject('Can only convert to valid output format: Use svg/png/jpg');
        }
    }
}

module.exports = ConvertService;