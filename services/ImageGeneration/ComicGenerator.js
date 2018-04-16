const ActivityType = require('../../model/EComponents').QSActivityType;
const SeqGenerator = require('./SVGGenerator');

const GenMap = {
    'input': 'generateInputSequence',
    'export': 'generateExportSequence',
    'aggregate': 'generateAggregationSequence',
    'visualize': 'generateVisualizationSequence',
    'request': 'generateRequestSequence',
    'sense': new Error('Not implemented')
};

exports.createComicFrames = function(document, size) {
    let comic = [];
    for (let activity of document.activities) {
        let activityType = getActivityType(activity);

        let seq = SeqGenerator[GenMap[activityType]](activity, size);
        comic.push(seq);
    }
    return comic;
};

exports.createStripe = function(activity, size) {
    let activityType = getActivityType(activity);
    return SeqGenerator[GenMap[activityType]](activity, size, true);
};

exports.createAllStripes = function(document, size) {
    let stripes = [];
    for(let activity of document.activities) {
        let activityType = getActivityType(activity);
        let stripe = SeqGenerator[GenMap[activityType]](activity, size, true);
        stripes.push(stripe);
    }
    return stripes;
};

exports.createComic = function(document, size) {
    let types = [];
    for(let activity of document.activities) {
        types.push(getActivityType(activity));
    }
    return SeqGenerator.generateComic(document, types, size);
};

function getActivityType(activity) {
    for(let key in ActivityType) {
        let value = ActivityType[key];
        if(activity.id.toLowerCase().indexOf(value) > -1)
            return ActivityType[key];
    }
    return new Error('Invalid activity type');
}