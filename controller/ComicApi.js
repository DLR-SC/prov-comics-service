const Formats = require('../model/EFileFormats');
const express = require('express');
const axios = require('axios');
const zipService = require('../services/ZipService');
const SVG_SIZE = 500;
const PROV_STORE_BASE_URL = 'https://provenance.ecs.soton.ac.uk/store/api/v0/';

module.exports = function (documentCtrl, comicGenerator) {
    const router = express.Router();

    //Applies for every request in this router
    router.use(function dataLog (req, res, next) {
        console.log('API Comic invoked with data... ');

        if (!req.is('application/json'))
            return res.status(400).send('Wrong content type, only JSON is supported');
        if(req.method == 'POST' && !req.body.data)
            return res.status(400).send('You need to send data for the api to work!');

        next();
    });

    /**
     * @api {post} /all Convert ProvDocument to Comic frames
     * @apiDescription Render ProvDocument as single images that are returned in a ZIP folder
     * @apiName GetAllComicFrames
     * @apiGroup COMIC
     * 
     * @apiParam {JSON} data    ProvDocument as JSON String
     * 
     * @apiSuccess {Zip} Base64 encoded zip archive
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/all', function (req, res) {
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let comic = comicGenerator.createComicFrames(doc, SVG_SIZE);
            let zipBuffer = zipService.comicFramesToZip(comic);
            res.send(zipBuffer);
            
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send('Invalid provenance document');
        }
    });

    /**
     * @api {post} /complete Convert ProvDocument to Comic image
     * @apiDescription Render ProvDocument as a single image and return it
     * @apiName GetComic
     * @apiGroup COMIC
     * 
     * @apiParam {JSON} data    ProvDocument as JSON String
     * 
     * @apiSuccess {SVG} SVG image of the comic
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/complete', function (req, res) {
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let comic = comicGenerator.createComic(doc, SVG_SIZE);
            
            res.type('.svg');
            return res.status(200).send(comic.data);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
    });

    /**
     * @api {post} /stripe Convert ProvDocument Activity to Comic Stripe
     * @apiDescription Convert ProvDocument and return a specific activity as rendered comic stripe
     * @apiName GetComicStripe
     * @apiGroup COMIC
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * @apiParam {Number} activity  index number of the stripe you want to get, starts with 0
     * 
     * @apiSuccess {SVG} SVG image of the wanted comic stripe
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/stripe', function (req, res) {
        let activityId = req.body.activity;
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            if(!activityId || activityId < 0 || activityId >= doc.activities.length) {
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

    /**
     * @api {post} /stripes Convert ProvDocument to folder of Comic Stripe
     * @apiDescription Render activities of a ProvDocument as list of comic stripes that are returned in a ZIP folder
     * @apiName GetComicStripes
     * @apiGroup COMIC
     * 
     * @apiParam {JSON} data    ProvDocument as JSON String
     *  
     * @apiSuccess {ZIP} ZIP folder of SVG images of the comic stripes
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/stripes', function (req, res) {
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let stripes = comicGenerator.createAllStripes(doc, SVG_SIZE);
            let zipBuffer = zipService.comicStripesToZip(stripes);
            return res.send(zipBuffer);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
    });

    /**
     * @api {get} /store/:documentId Download and render provenance document from ProvStore
     * @apiDescription Downloads specific Document from ProvStore and returns it rendered as single image (see /complete)
     * @apiName GetComicFromProvStore
     * @apiGroup COMIC
     * 
     * @apiParam {Number} documentId    id of the ProvStore document
     * 
     * @apiSuccess {SVG} SVG image of the converted and downloaded Provenance Graph
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.get('/store/:id', function(req, res) {
        let docId = req.params.id;
        let reqUrl = PROV_STORE_BASE_URL + 'documents/' + docId + '.json';
        axios.get(reqUrl).then(response => {
            try {
                let doc = documentCtrl.parseProvDocument(response.data, Formats.JSON);
                let comic = comicGenerator.createComic(doc, SVG_SIZE);
                res.type('.svg');
                return res.status(200).send(comic.data);
            } catch (ex) {
                console.error('Generation error: ', ex);
                return res.status(500).send(ex.message);
            }
        }).catch(error => {
            if (error.response) { //Error from server
                console.error(error.response.data);
                console.error(error.response.headers);
                return res.status(error.response.status).send(error.response.data);
            } else if (error.request) { // Error contacting server
                console.error(error.request);
                return res.status(500).send('ProvStore not reachable');
            }
        });

    });

    return router;
};