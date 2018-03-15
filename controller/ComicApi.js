const Formats = require('../model/EFileFormats');
const express = require('express');
const fs = require('fs');
const Archiver = require('archiver');

const responseType = 'application/zip';

module.exports = function (documentCtrl, comicGenerator) {
    const router = express.Router();

    //Applies for every request in this router
    router.use(function dataLog (req, res, next) {
        console.log('API Comic invoked with data... ');

        if (!req.is('application/json'))
            return res.status(400).send('Wrong content type, only JSON is supported');

        next();
    });

    router.post('/complete', function (req, res) {
        res.set('Content-Type', 'application/zip');
        //res.set('Content-Disposition', 'attachment; filename=comic.zip');
        //res.responseType = 'arraybuffer';

        let output = fs.createWriteStream(__dirname + '/../example.zip');
        let archive = Archiver('zip', { zlib: { level: 9 } });

        archive.on('error', function(err) {
            return res.status(500).send({ error: err.message });
        });

        archive.on('finish', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
            return res.end();
        });

        res.attachment('comic.zip');
        archive.pipe(res);

        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            let comic = comicGenerator.createComic(doc, 500);


            for (let seqKey in comic) {
                let seq = comic[seqKey];
                for(let frameKey in seq.data) {
                    let frame = seq.data[frameKey];
                    let filename = `${parseInt(seqKey) + 1}_${parseInt(frameKey) + 1}_frame_${seq.name.split(':')[1]}.svg`;

                    archive.append(frame, { name: filename });
                }
            }
        } catch (ex) {
            console.error(ex);
            return res.status(500).send('Invalid provenance document');
        }
        archive.finalize();
    });

    return router;
};
