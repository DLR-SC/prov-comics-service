const RaphaelSetup = require('./RaphaelSetup');
RaphaelSetup.setupRaphael();
const ActivityType = require('../../model/EComponents').QSActivityType;

const IntroGen = require('./FrameGenerator/IntroGenerator');
const InputInitGen = require('./FrameGenerator/InputInitGenerator');
const InputEndGen = require('./FrameGenerator/InputEndGenerator');

const ExportInitGen = require('./FrameGenerator/ExportInitGenerator');
const ExportActionGen = require('./FrameGenerator/ExportActionGenerator');
const ExportEndGen = require('./FrameGenerator/ExportEndGenerator');

const AggregationInitGen = require('./FrameGenerator/AggregationInitGenerator');
const AggregationActionGen = require('./FrameGenerator/AggregationActionGenerator');
const AggregationEndGen = require('./FrameGenerator/AggregationEndGenerator');

const RequestInitGen = require('./FrameGenerator/RequestInitGenerator');
const RequestActionGen = require('./FrameGenerator/RequestActionGenerator');
const RequestEndGen = require('./FrameGenerator/RequestEndGenerator');

const VisualizationInitGen = require('./FrameGenerator/VisualizationInitGenerator');
const VisualizationActionGen = require('./FrameGenerator/VisualizationActionGenerator');
const VisualizationEndGen = require('./FrameGenerator/VisualizationEndGenerator');

const Concater = require('./SequenceConcater');

//TODO: Rename Class to SVG Generator
class SVGGenerator {
    constructor() { throw new Error('Static class, do not call the constructor'); }


    static generateComic(document, activityTypes, size) {
        let generators = [];
        let index = 0;
        for(let type of activityTypes) {
            generators.push(this.getGenerators(type, document.activities[index], size));
            index++;
        }
        return this.generateAllStripes(document, size, generators);
    }

    static generateInputSequence(activity, size, stripe) {
        let generators = this.getGenerators(ActivityType.INPUT, activity, size);
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateExportSequence(activity, size, stripe) {
        let generators = this.getGenerators(ActivityType.EXPORT, activity, size);
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateAggregationSequence(activity, size, stripe) {
        let generators = this.getGenerators(ActivityType.AGGREGATION, activity, size);
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateRequestSequence(activity, size, stripe) {
        let generators = this.getGenerators(ActivityType.REQUEST, activity, size);
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateVisualizationSequence(activity, size, stripe) {
        let generators = this.getGenerators(ActivityType.VISUALIZATION, activity, size);
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateSequence(activity, size, generatorList) {
        let sequence = {
            name: activity.id,
            data : []
        };
        generatorList.forEach((value) => value.generate());
        generatorList.forEach((value) => sequence.data.push(value.toString()));

        return sequence;
    }

    static generateStripe(activity, size, generatorList) {
        let stripe = {
            name: activity.id,
            data: ''
        };
        generatorList.forEach((value) => value.generate());
        let con = new Concater([ generatorList ], size);
        con.generate();
        stripe.data = con.toString();
        return stripe;
        
    }

    static generateAllStripes(document, size, generatorList) {
        let comic = {
            name: 'comic',
            data: '',
            width: 0,
            height: 0
        };
        generatorList.forEach(seq => seq.forEach(frame => frame.generate()));
        let con = new Concater(generatorList, size);
        con.generate();
        comic.width = con.width;
        comic.height = con.height;
        comic.data = con.toString();
        return comic;
    }

    static getGenerators(type, activity, size) {
        let generators = {};
        generators[ActivityType.INPUT] = [ new IntroGen(activity, size), new InputInitGen(activity, size), new InputEndGen(activity, size) ];
        generators[ActivityType.EXPORT] = [ new IntroGen(activity, size), new ExportInitGen(activity, size), new ExportActionGen(activity, size), new ExportEndGen(activity, size)];
        generators[ActivityType.AGGREGATION] = [ new IntroGen(activity, size), new AggregationInitGen(activity, size), new AggregationActionGen(activity, size), new AggregationEndGen(activity, size)];
        generators[ActivityType.REQUEST] = [ new IntroGen(activity, size), new RequestInitGen(activity, size), new RequestActionGen(activity, size), new RequestEndGen(activity, size)];
        generators[ActivityType.VISUALIZATION] = [ new IntroGen(activity, size), new VisualizationInitGen(activity, size), new VisualizationActionGen(activity, size), new VisualizationEndGen(activity, size)];
        return generators[type];
    }
}
    
module.exports = SVGGenerator;