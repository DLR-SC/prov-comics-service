const Formats = require('../model/EFileFormats');
const express = require('express');
const axios = require('axios');
const zipService = require('../services/ZipService');
const convertService = require('../services/ConvertService');
const s3Service = require('../services/S3Service');

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
        if(req.method == 'POST' && !req.body.format)
            req.body.format = 'png';
        if(req.method == 'POST' && !req.body.size)
            req.body.size = SVG_SIZE;

        next();
    });

    /**
     * @api {post} /all Convert ProvDocument to Comic frames
     * @apiDescription Render ProvDocument as single images that are returned in a ZIP folder
     * @apiName GetAllComicFrames
     * @apiGroup Comic
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * @apiParam {Number} [size]    Size of the generated image
     * 
     * @apiSuccess {Zip} Base64 encoded zip archive
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/all', function (req, res) {
        let fileKey = Date.now() + '_comic_all.zip';
        documentCtrl.parseProvDocument(req.body.data, Formats.JSON).then(doc => {
            return comicGenerator.createAllFrames(doc, req.body.size);
        }).then(frames => {
            return zipService.comicFramesToZip(frames);
        }).then(zipData => {
            return s3Service.uploadFile(zipData, fileKey);
        }).then(data => {
            console.log('S3 Response: ', data);
            return res.send(s3Service.getUrl(fileKey));
        }).catch(err => {
            console.error('Generation error: ', err);
            return res.status(500).send(err);
        });
    });

    /**
     * @api {post} /complete Convert ProvDocument to Comic image
     * @apiDescription Render ProvDocument as a single image and return it
     * @apiName GetComic
     * @apiGroup Comic
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * @apiParam {Number} [size]    Size of the generated image
     * 
     * @apiSuccess {SVG} SVG image of the comic
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/complete', function (req, res) {
        let fileKey = Date.now() + '_comic_complete.' + req.body.format;
        documentCtrl.parseProvDocument(req.body.data, Formats.JSON).then(doc => {
            return comicGenerator.createComic(doc, req.body.size);
        }).then(comic => {
            return convertService.convertSvgString(comic, req.body.format);
        }).then(data => {
            return s3Service.uploadFile(data, fileKey);
        }).then(data => {
            console.log('S3 Response: ', data);
            return res.send(s3Service.getUrl(fileKey));
        }).catch( err => {
            console.error('Conversion/Upload error: ', err);
            return res.status(500).send(err);
        });
    });

    /**
     * @api {post} /stripe Convert ProvDocument Activity to Comic Stripe
     * @apiDescription Convert ProvDocument and return a specific activity as rendered comic stripe
     * @apiName GetComicStripe
     * @apiGroup Comic
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * @apiParam {Number} activity  Index number of the stripe you want to get, starts with 0
     * @apiParam {Number} [size]    Size of the generated image
     * 
     * @apiSuccess {SVG} SVG image of the wanted comic stripe
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/stripe', function (req, res) {
        let activityId = req.body.activity;
        let fileKey = Date.now() + '_stripe.' + req.body.format;
        documentCtrl.parseProvDocument(req.body.data, Formats.JSON).then(doc => {
            if(!activityId || activityId < 0 || activityId >= doc.activities.length)
                throw new Error('Invalid activity index');
            return comicGenerator.createStripe(doc.activities[activityId], req.body.size);
        }).then(stripe => {
            return  convertService.convertSvgString(stripe, req.body.format);
        }).then(data => {
            return s3Service.uploadFile(data, fileKey);
        }).then(data => {
            console.log('S3 Response: ', data);
            return res.send(s3Service.getUrl(fileKey));
        }).catch( err => {
            console.error('Conversion/Upload error: ', err);
            return res.status(500).send(err);
        });
    });

    /**
     * @api {post} /stripes Convert ProvDocument to folder of Comic Stripe
     * @apiDescription Render activities of a ProvDocument as list of comic stripes that are returned in a ZIP folder
     * @apiName GetComicStripes
     * @apiGroup Comic
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * @apiParam {Number} [size]    Size of the generated image
     *  
     * @apiSuccess {ZIP} ZIP folder of SVG images of the comic stripes
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.post('/stripes', function (req, res) {
        let fileKey = Date.now() + '_comic_stripes.zip';
        documentCtrl.parseProvDocument(req.body.data, Formats.JSON).then(doc => {
            return comicGenerator.createAllStripes(doc, req.body.size);
        }).then(stripes => {
            return zipService.comicStripesToZip(stripes);
        }).then(zipData => {
            return s3Service.uploadFile(zipData, fileKey);
        }).then(data => {
            console.log('S3 Response: ', data);
            return res.send(s3Service.getUrl(fileKey));
        }).catch(err => {
            console.error('Upload error: ', err);
            return res.status(500).send(err);
        });
    });

    /**
     * @api {get} /store/:documentId Download and render provenance document from ProvStore
     * @apiDescription Downloads specific Document from ProvStore and returns it rendered as single image (see /complete)
     * @apiName GetComicFromProvStore
     * @apiGroup Comic
     * 
     * @apiParam {Number} documentId    id of the ProvStore document
     * @apiParam {Number} [size]        Size of the generated image
     * 
     * @apiSuccess {SVG} SVG image of the converted and downloaded Provenance Graph
     * 
     * @apiError ParsingError ProvDocument could not be parsed
     */
    router.get('/store/:id', function(req, res) {
        let docId = req.params.id;
        let reqUrl = PROV_STORE_BASE_URL + 'documents/' + docId + '.json';
        let fileKey = Date.now() + '_comic_complete.' + req.body.format;
        axios.get(reqUrl).then(response => {
            return documentCtrl.parseProvDocument(response.data, Formats.JSON);
        }).then(doc => {
            return comicGenerator.createComic(doc, req.body.size);
        }).then(comic => {
            return convertService.convertSvgString(comic, 'png');
        }).then(data => {
            return s3Service.uploadFile(data, fileKey);
        }).then(data => {
            console.log('S3 Response: ', data);
            return res.send(s3Service.getUrl(fileKey));
        }).catch(error => {
            if (error.response) { //Error from server
                console.error(error.response.data);
                console.error(error.response.headers);
                return res.status(error.response.status).send(error.response.data);
            } else if (error.request) { // Error contacting server
                console.error(error.request);
                return res.status(500).send('ProvStore not reachable');
            } else {
                console.error('Generation error: ', error);
                return res.status(500).send(error);
            }
        });
    });

    return router;
};