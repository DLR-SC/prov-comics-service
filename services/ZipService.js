const Zip = require('node-zip');
class ZipService {
    constructor() {
        throw new Error('Static class, should not be initialized');
    }

    static comicFramesToZip(comic) {
        //console.log(comic);
        const zip = new Zip;

        for (let seqKey in comic) {
            let seq = comic[seqKey];
            for(let frameKey in seq.data) {
                let frame = seq.data[frameKey];
                let filename = `${parseInt(seqKey) + 1}_${parseInt(frameKey) + 1}_frame_${seq.name.split(':')[1]}.svg`;

                zip.file(filename, frame);
            }
        }
        const options = { base64: true, compression: 'STORE' };
        return Promise.resolve(Buffer.from(zip.generate(options), 'base64'));
    }

    static comicStripesToZip(stripes) {
        const zip = new Zip;
        
        for (let stripeKey in stripes) {
            let stripe = stripes[stripeKey];
            let filename = `${parseInt(stripeKey) + 1}_frame_${stripe.name.split(':')[1]}.svg`;
            zip.file(filename, stripe.data);
            
        }
        const options = { base64: true, compression:'STORE' };
        return Promise.resolve(Buffer.from(zip.generate(options), 'base64'));
    }
}

module.exports = ZipService;