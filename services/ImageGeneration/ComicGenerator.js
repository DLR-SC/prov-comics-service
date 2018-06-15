const ActivityType = require('../../model/EComponents').QSActivityType;
const SeqGenerator = require('./SVGGenerator');

const GenMap = {
    'input': 'generateInputSequence',
    'export': 'generateExportSequence',
    'aggregate': 'generateAggregationSequence',
    'visualize': 'generateVisualizationSequence',
    'request': 'generateRequestSequence',
    'sensing': 'generateSensingSequence'
};

exports.createComicFrames = function(document, size) {
    let comic = [];
    try {
        for (let activity of document.activities) {
            let activityType = getActivityType(activity);

            let seq = SeqGenerator[GenMap[activityType]](activity, size);
            comic.push(seq);
        }
    } catch(ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve(comic);
};

exports.createStripe = function(activity, size) {
    let stripe = null;
    try {
        let activityType = getActivityType(activity);
        stripe = SeqGenerator[GenMap[activityType]](activity, size, true);
    } catch(ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve(stripe);
};

exports.createAllStripes = function(document, size) {
    let stripes = [];
    try {
        for(let activity of document.activities) {
            let activityType = getActivityType(activity);
            let stripe = SeqGenerator[GenMap[activityType]](activity, size, true);
            stripes.push(stripe);
        }
    } catch(ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve(stripes);
};

exports.createComic = function(document, size) {
    let comic = null;
    try {
        let types = [];
        for(let activity of document.activities) {
            types.push(getActivityType(activity));
        }
        comic = SeqGenerator.generateComic(document, types, size);
    } catch(ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve(comic);
};

function getActivityType(activity) {
    for(let key in ActivityType) {
        let value = ActivityType[key];
        if(activity.id.toLowerCase().indexOf(value) > -1)
            return ActivityType[key];
    }
    return new Error('Invalid activity type');
}