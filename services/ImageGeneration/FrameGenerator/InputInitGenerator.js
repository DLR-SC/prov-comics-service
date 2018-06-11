const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Device = require('../Device');

class InputInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        //Builder.buildSmartphone(this.paper, this.activity.software.label);
        new Device(0, 0, 1.0, this.paper, this.activity.software.device, this.activity.software.label).draw();
        Builder.buildInput(this.paper, this.activity.software.device);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = InputInitGenerator;