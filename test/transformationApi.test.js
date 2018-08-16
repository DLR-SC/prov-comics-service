//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let should = chai.should();
let expect = chai.expect;
//let assert = chai.assert();
const request = require('request');

chai.use(chaiHttp);

const DEPLOY_ID = 'au9tkaovje';
const BASE_URL = 'https://' + DEPLOY_ID +'.execute-api.eu-central-1.amazonaws.com/dev/api/v1/transformation/';

describe('test transformation api document', () => {

    //Testing add/ route
    describe('/add route', () => {
        it('adding document to S3 returns status 200', (done) => {
            request(BASE_URL + 'add', { method: 'POST', json: {"data": {"prefix": {"qs": "http://software.dlr.de/qs/", "user": "http://software.dlr.de/qs/user/", "userdata": "http://software.dlr.de/qs/userdata/", "app": "http://software.dlr.de/qs/app/", "device": "http://software.dlr.de/qs/device/", "method": "http://www.java.com/"}, "wasGeneratedBy": {"_:id1": {"prov:role": "updating", "prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureNow", "prov:time": "2016-12-01T16:06:22+00:00"}}, "activity": {"method:sensing": {"prov:endTime": "2016-12-01T16:06:22+00:00", "prov:startTime": "2016-12-01T16:06:21+00:00"}}, "entity": {"qs:userdata/bloodpressureNow": {"prov:label": "Blood pressure after input", "prov:type": "bloodpressure"}, "qs:userdata/bloodpressureThen": {"prov:label": "Blood pressure before input", "prov:type": "bloodpressure"}}, "agent": {"qs:app/bloodpressureapp": {"prov:label": "Blood pressure sensor", "prov:type": "prov:SoftwareAgent", "qs:device": "sensor"}, "qs:user/regina@example.org": {"prov:label": "Regina Struminski", "prov:type": "prov:Person"}}, "wasAttributedTo": {"_:id2": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureThen"}, "_:id3": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureNow"}}, "actedOnBehalfOf": {"_:id4": {"prov:delegate": "qs:app/bloodpressureapp", "prov:responsible": "qs:user/regina@example.org"}}, "used": {"_:id5": {"prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureThen", "prov:time": "2016-12-01T16:06:21+00:00"}}, "wasDerivedFrom": {"_:id6": {"prov:generatedEntity": "qs:userdata/bloodpressureNow", "prov:usedEntity": "qs:userdata/bloodpressureThen"}}, "wasAssociatedWith": {"_:id7": {"prov:activity": "method:sensing", "prov:agent": "qs:app/bloodpressureapp"}, "_:id8": {"prov:role": "providing input", "prov:activity": "method:sensing", "prov:agent": "qs:user/regina@example.org"}}}} }, (err, res, data) => {
                expect(res.statusCode, "status code").to.equal(200);
                done();
            });
        });

        it('adding document to has s3 url', (done) => {
            request(BASE_URL + 'add', { method: 'POST', json: {"data": {"prefix": {"qs": "http://software.dlr.de/qs/", "user": "http://software.dlr.de/qs/user/", "userdata": "http://software.dlr.de/qs/userdata/", "app": "http://software.dlr.de/qs/app/", "device": "http://software.dlr.de/qs/device/", "method": "http://www.java.com/"}, "wasGeneratedBy": {"_:id1": {"prov:role": "updating", "prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureNow", "prov:time": "2016-12-01T16:06:22+00:00"}}, "activity": {"method:sensing": {"prov:endTime": "2016-12-01T16:06:22+00:00", "prov:startTime": "2016-12-01T16:06:21+00:00"}}, "entity": {"qs:userdata/bloodpressureNow": {"prov:label": "Blood pressure after input", "prov:type": "bloodpressure"}, "qs:userdata/bloodpressureThen": {"prov:label": "Blood pressure before input", "prov:type": "bloodpressure"}}, "agent": {"qs:app/bloodpressureapp": {"prov:label": "Blood pressure sensor", "prov:type": "prov:SoftwareAgent", "qs:device": "sensor"}, "qs:user/regina@example.org": {"prov:label": "Regina Struminski", "prov:type": "prov:Person"}}, "wasAttributedTo": {"_:id2": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureThen"}, "_:id3": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureNow"}}, "actedOnBehalfOf": {"_:id4": {"prov:delegate": "qs:app/bloodpressureapp", "prov:responsible": "qs:user/regina@example.org"}}, "used": {"_:id5": {"prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureThen", "prov:time": "2016-12-01T16:06:21+00:00"}}, "wasDerivedFrom": {"_:id6": {"prov:generatedEntity": "qs:userdata/bloodpressureNow", "prov:usedEntity": "qs:userdata/bloodpressureThen"}}, "wasAssociatedWith": {"_:id7": {"prov:activity": "method:sensing", "prov:agent": "qs:app/bloodpressureapp"}, "_:id8": {"prov:role": "providing input", "prov:activity": "method:sensing", "prov:agent": "qs:user/regina@example.org"}}}} }, (err, res, data) => {
                expect(data).to.have.property('url');
                expect(data).to.have.property('name');
                done();
            });
        });
    });

    //Testing image route
    describe('/image route', () => {
        let provDocName;

        before((done) => {
            request(BASE_URL + 'add', { method: 'POST', json: {"data": {"prefix": {"qs": "http://software.dlr.de/qs/", "user": "http://software.dlr.de/qs/user/", "userdata": "http://software.dlr.de/qs/userdata/", "app": "http://software.dlr.de/qs/app/", "device": "http://software.dlr.de/qs/device/", "method": "http://www.java.com/"}, "wasGeneratedBy": {"_:id1": {"prov:role": "updating", "prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureNow", "prov:time": "2016-12-01T16:06:22+00:00"}}, "activity": {"method:sensing": {"prov:endTime": "2016-12-01T16:06:22+00:00", "prov:startTime": "2016-12-01T16:06:21+00:00"}}, "entity": {"qs:userdata/bloodpressureNow": {"prov:label": "Blood pressure after input", "prov:type": "bloodpressure"}, "qs:userdata/bloodpressureThen": {"prov:label": "Blood pressure before input", "prov:type": "bloodpressure"}}, "agent": {"qs:app/bloodpressureapp": {"prov:label": "Blood pressure sensor", "prov:type": "prov:SoftwareAgent", "qs:device": "sensor"}, "qs:user/regina@example.org": {"prov:label": "Regina Struminski", "prov:type": "prov:Person"}}, "wasAttributedTo": {"_:id2": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureThen"}, "_:id3": {"prov:agent": "qs:user/regina@example.org", "prov:entity": "qs:userdata/bloodpressureNow"}}, "actedOnBehalfOf": {"_:id4": {"prov:delegate": "qs:app/bloodpressureapp", "prov:responsible": "qs:user/regina@example.org"}}, "used": {"_:id5": {"prov:activity": "method:sensing", "prov:entity": "qs:userdata/bloodpressureThen", "prov:time": "2016-12-01T16:06:21+00:00"}}, "wasDerivedFrom": {"_:id6": {"prov:generatedEntity": "qs:userdata/bloodpressureNow", "prov:usedEntity": "qs:userdata/bloodpressureThen"}}, "wasAssociatedWith": {"_:id7": {"prov:activity": "method:sensing", "prov:agent": "qs:app/bloodpressureapp"}, "_:id8": {"prov:role": "providing input", "prov:activity": "method:sensing", "prov:agent": "qs:user/regina@example.org"}}}} }, (err, res, data) => {
                provDocName = data.name;
                done();
            });
        });

        it('createAllStripes', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createAllStripes/jpg.500', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(data.indexOf('jpg') > -1).to.be.true;
                done();
            });
        });

        it('createAllFrames', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createAllFrames/jpg.500', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(dataObj.url).to.be.an.instanceOf(Array);
                expect(data.indexOf('jpg') > -1).to.be.true;
                done();
            });
        });

        it('createComic', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createComic/jpg.500', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(data.indexOf('jpg') > -1).to.be.true;
                expect(dataObj.url).to.not.be.an.instanceOf(Array);
                done();
            });
        });

        it('createStripe', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createStripe/jpg.500/0', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(data.indexOf('jpg') > -1).to.be.true;
                expect(dataObj.url).to.not.be.an.instanceOf(Array);
                done();
            });
        });

        it('createStripe with incorrect index', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createStripe/jpg.500/9999', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                expect(res.statusCode, "status code").to.equal(500);
                done();
            });
        });

        it('createAllStripes SVG', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createAllStripes/svg.500', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(data.indexOf('svg') > -1).to.be.true;
                done();
            });
        });

        it('createAllFrames SVG', (done) => {
            request(BASE_URL + 'image/' + provDocName + '/createAllFrames/svg.500', { method: 'GET', headers: { 'Content-Type': 'application/json' } }, (err, res, data) => {
                dataObj = JSON.parse(data);
                expect(res.statusCode, "status code").to.equal(200);
                expect(dataObj).to.have.property('url');
                expect(dataObj.url).to.be.an.instanceOf(Array);
                expect(data.indexOf('svg') > -1).to.be.true;
                done();
            });
        });
      
    });
});