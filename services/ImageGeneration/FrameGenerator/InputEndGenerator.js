const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class InputEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size);
        this.activity = activity;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildEntity(this.paper, 200, 170, 1.0);
        Builder.buildCheck(this.paper, 220, 300);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = InputEndGenerator;