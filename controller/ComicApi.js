const Formats = require('../model/EFileFormats');
const express = require('express');
const Zip = require('node-zip');

const SVG_SIZE = 500;

module.exports = function (documentCtrl, comicGenerator) {
    const router = express.Router();

    //Applies for every request in this router
    router.use(function dataLog (req, res, next) {
        console.log('API Comic invoked with data... ');

        if (!req.is('application/json'))
            return res.status(400).send('Wrong content type, only JSON is supported');

        next();
    });

    router.post('/all', function (req, res) {
        const zip = new Zip;

        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            let comic = comicGenerator.createComicFrames(doc, SVG_SIZE);

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

    router.post('/complete', function (req, res) {
        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            let comic = comicGenerator.createComic(doc, SVG_SIZE);
            
            res.type('.svg');
            return res.status(200).send(comic.data);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
    });

    router.post('/stripe/:act', function (req, res) {
        let activityId = req.params.act;
        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            if(activityId < 0 || activityId >= doc.activities.length) {
                throw new Error('Invalid activity index');
            }
            let stripe = comicGenerator.createStripe(doc.activities[activityId], SVG_SIZE);

            res.type('.svg');
            return res.status(200).send(stripe.data);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
    });

    router.post('/stripes', function (req, res) {
        const zip = new Zip;
        try {
            let doc = documentCtrl.parseProvDocument(req.body, Formats.JSON);
            let stripes = comicGenerator.createAllStripes(doc, SVG_SIZE);

            for (let stripeKey in stripes) {
                let stripe = stripes[stripeKey];
                let filename = `${parseInt(stripeKey) + 1}_frame_${stripe.name.split(':')[1]}.svg`;
                zip.file(filename, stripe.data);
                
            }
            const options = { base64: true, compression:'STORE' };
            let zipBuffer = zip.generate(options);
            return res.send(zipBuffer);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
    });

    return router;
};