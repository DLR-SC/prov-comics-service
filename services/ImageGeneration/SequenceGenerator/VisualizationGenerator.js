const IntroGen = require('../FrameGenerator/IntroGenerator');
const StartGen = require('../FrameGenerator/VisualizationInitGenerator');
const ActionGen = require('../FrameGenerator/VisualizationActionGenerator');
const EndGen = require('../FrameGenerator/VisualizationEndGenerator');

class VisualizationGenerator {
    constructor() { throw new Error('Static class, do not call the constructor'); }

    static generateInputSequence(activity, size) {
        let generators = [ new IntroGen(activity, size), new StartGen(activity, size), new ActionGen(activity, size), new EndGen(activity, size) ];

        let sequence = [];
        generators.forEach((value) => value.generate());
        generators.forEach((value) => sequence.push(value.toString()));

        return sequence;
    }
}

module.exports = VisualizationGenerator;