const InFormats = require('../model/EFileFormats');
const OutFormats = require('./EResFileFormats');
const ConvOpt = require('./EConversionOptions');
const express = require('express');
const zipService = require('../services/ZipService');
const convertService = require('../services/ConvertService');
const s3Service = require('../services/S3Service');
const imageVal = require('./validator/ImageOptionsValidator');

const SVG_SIZE = 500;
const PROV_STORE_BASE_URL = 'https://provenance.ecs.soton.ac.uk/store/api/v0/';

module.exports = function (documentCtrl, comicGenerator) {
    const router = express.Router();

    //Applies for every request in this router
    router.use(function dataLog (req, res, next) {
        console.log('API Doc invoked with data... ');

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
     * @api {post} /add Upload a ProvDocument
     * @apiDescription Upload ProvDocument to use it in later API calls
     * @apiName UploadDocument
     * @apiGroup Doc
     * 
     * @apiParam {JSON} data        ProvDocument as JSON String
     * 
     * @apiSuccess {Url} url URL for the created file
     * 
     * @apiError UploadError ProvDocument could not be uploaded
     */
    router.post('/add', function (req, res) {
        let fileKey = 'provenance_document_' + Date.now();
        let load = JSON.stringify(req.body.data);
        s3Service.uploadFile(load, fileKey, { ContentType: 'application/json' }).then(s3res => {
            return res.json({ msg: 'Document uploaded. You can now perform actions on with the given name', name: fileKey, url: s3Service.getUrl(fileKey), serverRes: s3res });
        }).catch(err => {
            console.error('Upload error: ', err);
            return res.status(500).send(err);
        });
    });

    /**
     * @api {get} /image/:name/:mode/:format/:act? Get a ProvDocument in the specified format
     * @apiDescription Get a ProvDocument in a specified format and size, has to be uploaded before
     * @apiName ConvertDocument
     * @apiGroup Doc
     * 
     * @apiParam {String} name          Name of the ProvDocument, is returned with the UploadDocument function
     * @apiParam {String} mode          Defines which action will be performed on the document ('createComicFrames', 'createAllStripes', 'createStripe', 'createComic')
     * @apiParam {String} format        Image Type and Size, has to be given in this format: <Type>.<Size>; <Type> can be png, svg or jpg; <Size> can be any integer numnber
     * @apiParam {Number} [act]         If you used the mode 'createStripe' this specifies the activity id
     * 
     * @apiSuccess {Url} url URL for the created file
     * 
     * @apiError GenerationError ProvDocument could not be created, converted or send
     */
    router.get('/image/:name/:mode/:format/:act?', function(req, res) {
        console.log('Node version: ', process.versions);

        let parameter;
        let key;
        imageVal.validate(req.params.name, req.params.mode, req.params.format, req.params.act).then(params => {
            parameter = params;
            console.log(parameter, parameter.activity);
            return s3Service.getFile(params.name, { ResponseContentType: 'application/json' });
        }).then(file => {
            //console.log(file);
            return documentCtrl.parseProvDocument(file.Body.toString(), InFormats.JSON);
        }).then(doc => {
            console.log(parameter.mode, ConvOpt.SINGLE_STRIPE);
            if(parameter.mode == ConvOpt.SINGLE_STRIPE) {
                console.log(parameter.mode, doc);
                return comicGenerator[parameter.mode](doc.activities[parameter.activity], parameter.frameSize);
            }
            return comicGenerator[parameter.mode](doc, parameter.frameSize);
        }).then(comicResult => {
            if(parameter.mode == ConvOpt.ALL_FRAMES) {
                return zipService.comicFramesToZip(comicResult,  parameter);
            } else if(parameter.mode == ConvOpt.ALL_STRIPES) {
                return zipService.comicStripesToZip(comicResult, parameter);
            } else if(parameter.imageType == OutFormats.SVG) {
                return Promise.resolve(comicResult.data);
            } else {
                return convertService.convertSvgString(comicResult, parameter.imageType);
            }
        }).then(result => {
            key = parameter.name + '.' + parameter.imageType;
            //console.log('Res: ', result)
            return s3Service.uploadFile(result, key);
        }).then(uploadRes => {
            return res.send({ msg: 'Here is your converted document.', name: key, url: s3Service.getUrl(key), serverResponse: uploadRes });
        }).catch(err => {
            console.error('Generation error: ', err);
            return res.status(500).send(err);
        });
    });

    return router;
};