const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Device = require('../Device');
const DSymbol = require('../DataSymbol');

class SensingActionGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        new Device(50, 170, 1.0, this.paper, this.activity.software.device, this.activity.software.label).draw(false);
        Builder.buildSensingArm(this.paper);
        Builder.buildSensingTransmission(this.paper);
        Builder.buildCloud(this.paper, 'Sensing...', 250, 335, 0.8);
        new DSymbol(162, 92, 0.85, 0, this.activity.created.type, this.paper, '#000').draw();
    }
}

module.exports = SensingActionGenerator;