const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');
const Device = require('../Device');

class InputEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        //Builder.buildSmartphone(this.paper, this.activity.software.label);
        new Device(0, 0, 1.0, this.paper, this.activity.software.device, this.activity.software.label).draw();
        new Entity(170, 200, 1.0, this.activity.created.type, this.paper, false, false).draw();
        Builder.buildCheck(this.paper, 220, 300);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = InputEndGenerator;