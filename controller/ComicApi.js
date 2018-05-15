const Formats = require('../model/EFileFormats');
const express = require('express');
const axios = require('axios');
const zipService = require('../services/ZipService');
const convertService = require('../services/ConvertService');
const s3Service = require('../services/S3Service');
const fs = require('fs');

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
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let comic = comicGenerator.createComicFrames(doc, req.body.size);
            let fileKey = Date.now() + '_comic_all.zip';

            zipService.comicFramesToZip(comic).then(zipData => {
                return s3Service.uploadFile(Buffer.from(zipData, 'base64'), fileKey);
            }).then(data => {
                console.log('S3 Response: ', data);
                return res.send(s3Service.getUrl(fileKey));
            }).catch(err => {
                console.error('Upload error: ', err);
                return res.status(500).send(err);
            });
            
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send('Invalid provenance document');
        }
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
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let comic = comicGenerator.createComic(doc, req.body.size);
            let fileKey = Date.now() + '_comic_complete.' + req.body.format;

            convertService.convertSvgString(comic, req.body.format).then(data => {
                return s3Service.uploadFile(data, fileKey);
            }).then(data => {
                console.log('S3 Response: ', data);
                return res.send(s3Service.getUrl(fileKey));
            }).catch( err => {
                console.error('Conversion/Upload error: ', err);
                return res.status(500).send(err);
            });

            //return res.status(200).send(comic.data);
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
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
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            if(!activityId || activityId < 0 || activityId >= doc.activities.length) {
                throw new Error('Invalid activity index');
            }
            let stripe = comicGenerator.createStripe(doc.activities[activityId], req.body.size);
            let fileKey = Date.now() + '_stripe.' + req.body.format;

            convertService.convertSvgString(stripe, req.body.format).then(data => {
                return s3Service.uploadFile(data, fileKey);
            }).then(data => {
                console.log('S3 Response: ', data);
                return res.send(s3Service.getUrl(fileKey));
            }).catch( err => {
                console.error('Conversion/Upload error: ', err);
                return res.status(500).send(err);
            });
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
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
        try {
            let doc = documentCtrl.parseProvDocument(req.body.data, Formats.JSON);
            let stripes = comicGenerator.createAllStripes(doc, req.body.size);
            let fileKey = Date.now() + '_comic_stripes.zip';

            zipService.comicStripesToZip(stripes).then(zipData => {
                return s3Service.uploadFile(Buffer.from(zipData, 'base64'), fileKey);
            }).then(data => {
                console.log('S3 Response: ', data);
                return res.send(s3Service.getUrl(fileKey));
            }).catch(err => {
                console.error('Upload error: ', err);
                return res.status(500).send(err);
            });
        } catch (ex) {
            console.error('Generation error: ', ex);
            return res.status(500).send(ex.message);
        }
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
        axios.get(reqUrl).then(response => {
            try {
                let doc = documentCtrl.parseProvDocument(response.data, Formats.JSON);
                let comic = comicGenerator.createComic(doc, req.body.size);

                let fileKey = Date.now() + '_comic_complete.' + req.body.format;
                convertService.convertSvgString(comic, 'png').then(data => {
                    return s3Service.uploadFile(data, fileKey);
                }).then(data => {
                    console.log('S3 Response: ', data);
                    return res.send(s3Service.getUrl(fileKey));
                }).catch( err => {
                    console.error('Conversion/Upload error: ', err);
                    return res.status(500).send(err);
                });
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