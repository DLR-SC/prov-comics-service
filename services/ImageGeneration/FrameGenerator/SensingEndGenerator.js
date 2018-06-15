const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Device = require('../Device');
const Entity = require('../Entity');
const DSymbol = require('../DataSymbol');

class SensingEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        new Device(50, 170, 1.0, this.paper, this.activity.software.device, this.activity.software.label).draw(false);
        Builder.buildSensingArm(this.paper);
        new DSymbol(162, 92, 0.85, 0, this.activity.created.type, this.paper, '#000').draw();
        new Entity(225, 333, 1.0, this.activity.created.type, this.paper).draw();

        this.paper.text(395, 178, 'Done!').attr({ 'font-size': 16, 'font-weight': 'bold', fill: '#fff', 'text-anchor': 'middle' });

    }
}

module.exports = SensingEndGenerator;