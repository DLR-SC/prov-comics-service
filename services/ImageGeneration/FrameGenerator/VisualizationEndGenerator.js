const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class ExportEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size);
        this.activity = activity;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildChart(this.paper, 'steps');
        Builder.buildCheck(this.paper, 230, 320);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = ExportEndGenerator;