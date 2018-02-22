const IntroGen = require('../FrameGenerator/IntroGenerator');
const InitGen = require('../FrameGenerator/ExportInitGenerator');
const ActionGen = require('../FrameGenerator/ExportActionGenerator');

class ExportGenerator {
    constructor() { throw new Error('Static class, do not call the constructor'); }

    static generateInputSequence(activity, size) {
        let generators = [ new IntroGen(activity, size), new InitGen(activity, size), new ActionGen(activity, size)];
        let sequence = [];

        generators.forEach((value) => value.generate());
        generators.forEach((value) => sequence.push(value.toString()));

        return sequence;
    }
}

module.exports = ExportGenerator;