const Formats = require('../model/EFileFormats');
const express = require('express');
const fs = require('fs');
const Zip = require('node-zip');
const path = require('path');

const responseType = 'application/zip';

module.exports = function (documentCtrl, comicGenerator) {
    const router = express.Router();
    const data = null;

    //Applies for every request in this router
    router.use(function dataLog (req, res, next) {
        console.log('API Comic invoked with data... ');

        if (!req.is('application/json'))
            return res.status(400).send('Wrong content type, only JSON is supported');

        next();
    });

    router.post('/complete', function (req, res) {
        const zip = new Zip;

        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            let comic = comicGenerator.createComic(doc, 500);

            for (let seqKey in comic) {
                let seq = comic[seqKey];
                for(let frameKey in seq.data) {
                    let frame = seq.data[frameKey];
                    let filename = `${parseInt(seqKey) + 1}_${parseInt(frameKey) + 1}_frame_${seq.name.split(':')[1]}.svg`;

                    zip.file(filename, frame);
                }
            }
            const options = { base64: true, compression:'STORE' };
            let zipBuffer = zip.generate(options);
            res.send(zipBuffer);
            
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send('Invalid provenance document');
        }
    });

    return router;
};