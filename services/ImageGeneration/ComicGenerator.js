const ActivityType = require('../../model/EComponents').QSActivityType;
const SeqGenerator = require('./SequenceGenerator');

exports.createComic = function(document, size) {
    let comic = [];
    for (let activity of document.activities) {
        let activityType = getActivityType(activity);

        switch (activityType) {
        case ActivityType.INPUT:
            comic.push(SeqGenerator.generateInputSequence(activity, size));
            break;
        case ActivityType.EXPORT:
            comic.push(SeqGenerator.generateExportSequence(activity, size));
            break;
        case ActivityType.VISUALIZATION:
            comic.push(SeqGenerator.generateVisualizationSequence(activity, size));
            break;
        case ActivityType.AGGREGATION:
            comic.push(SeqGenerator.generateAggregationSequence(activity, size));
            break;
        case ActivityType.REQUEST:
            comic.push(SeqGenerator.generateRequestSequence(activity, size));
            break;
        case ActivityType.SENSING:
            throw new Error('Not yet implemented.');
        default:
            throw new Error('Invalid activity type: Only QS Activities are allowed.');
        }
    }
    return comic;
};

function getActivityType(activity) {
    for(let key in ActivityType) {
        let value = ActivityType[key];
        if(activity.id.toLowerCase().indexOf(value) > -1)
            return ActivityType[key];
    }
    return null;
}