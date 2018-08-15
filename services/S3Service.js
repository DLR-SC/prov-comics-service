const AWS = require('aws-sdk');
const config = require('../config/config');

const s3 = new AWS.S3({ region: config.REGION });
const lambda = new AWS.Lambda({ region: config.REGION });

//TODO: Rename class
class S3Service {
    constructor() {
        throw new Error('Static class, should not be initialized');
    }

    static uploadFile(data, filename, optParams) {
        let params = {
            Bucket: config.BUCKET,
            Key: filename,
            Body: data,
        };
        if(optParams) {
            params = Object.assign({}, params, optParams);
        }
        return s3.putObject(params).promise();
    }

    static uploadFiles(files) {
        let promises = [];
        let params = {
            Bucket: config.BUCKET,
            Key: null,
            Body: null,
        };
        let idx = 0;
        for(let data of files) {
            params.Body = data;
            params.Key = 'provenance_image' + Math.floor(new Date().getTime() / 1000) + '_' + idx + '.svg';
            promises.push(s3.putObject(params).promise());
            idx++;
        }
        return Promise.all(promises);
    }

    static getFile(name, optParams) {
        let params = {
            Bucket: config.BUCKET,
            Key: name
        };
        if(optParams) {
            params = Object.assign({}, params, optParams);
        }
        return s3.getObject(params).promise();
    }

    static getUrl(filename) {
        return s3.getSignedUrl('getObject', { Bucket: config.BUCKET, Key: filename });
    }

    static invokeLambda(payload, type, mode) {
        //mode is 'svg2binary' or 'svgs2binary'
        let params = { 
            FunctionName : config.TRANSCODER_FUNCTION_NAME + mode, 
            InvocationType : 'RequestResponse', 
            LogType : 'None', 
            Payload: JSON.stringify({ binaryType: type, body: payload })
        };
        return lambda.invoke(params).promise();
    }
}

module.exports = S3Service;