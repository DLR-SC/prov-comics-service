const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class InputInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildInput(this.paper);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = InputInitGenerator;