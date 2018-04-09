const RaphaelSetup = require('./RaphaelSetup');
RaphaelSetup.setupRaphael();

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


class SequenceGenerator {
    constructor() { throw new Error('Static class, do not call the constructor'); }

    static generateInputSequence(activity, size, stripe) {
        let generators = [ new IntroGen(activity, size), new InputInitGen(activity, size), new InputEndGen(activity, size) ];
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateExportSequence(activity, size, stripe) {
        let generators = [ new IntroGen(activity, size), new ExportInitGen(activity, size), new ExportActionGen(activity, size), new ExportEndGen(activity, size)];
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateAggregationSequence(activity, size, stripe) {
        let generators = [ new IntroGen(activity, size), new AggregationInitGen(activity, size), new AggregationActionGen(activity, size), new AggregationEndGen(activity, size)];
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateRequestSequence(activity, size, stripe) {
        let generators = [ new IntroGen(activity, size), new RequestInitGen(activity, size), new RequestActionGen(activity, size), new RequestEndGen(activity, size)];
        if(stripe)
            return this.generateStripe(activity, size, generators);
        return this.generateSequence(activity, size, generators);
    }

    static generateVisualizationSequence(activity, size, stripe) {
        let generators = [ new IntroGen(activity, size), new VisualizationInitGen(activity, size), new VisualizationActionGen(activity, size), new VisualizationEndGen(activity, size)];
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
        let con = new Concater(generatorList, size);
        con.generate();
        stripe.data = con.toString();
        return stripe;
        
    }
}

module.exports = SequenceGenerator;