const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Device = require('../Device');
const DSymbol = require('../DataSymbol');

class SensingInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        Builder.buildBraceletZoom(this.paper, this.activity.created.type);
        new Device(0, 0, 1.0, this.paper, this.activity.software.device, this.activity.software.label);
        new DSymbol(197, 246, 0.35, 0, this.activity.created.type, this.paper, '#000').draw();
        
    }
}

module.exports = SensingInitGenerator;