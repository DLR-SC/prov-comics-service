const AWS = require('aws-sdk');
const config = require('../config/config');

const s3 = new AWS.S3({ region: config.REGION });

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
}

module.exports = S3Service;