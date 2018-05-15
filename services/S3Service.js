const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'eu-central-1' });
const BUCKET = 'prov-comics-access-storage';

class S3Service {
    constructor() {
        throw new Error('Static class, should not be initialized');
    }

    static uploadFile(data, filename) {
        let params = {
            Bucket: BUCKET,
            Key: filename,
            Body: data,
        };
        return s3.putObject(params).promise();
    }

    static getUrl(filename) {
        return s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: filename });
    }
}

module.exports = S3Service;