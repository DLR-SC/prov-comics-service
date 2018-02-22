const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class ExportInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size);
        this.activity = activity;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildEntity(this.paper);

        this.paper.rect(193, 320, 130, 30, 5).attr({ fill: '#fff', stroke: '#aaa' });
        this.paper.text(225, 169.5, 'Export ' + this.activity.created.type.toUpperCase()).attr({ fill: '#000', 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'start' });

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = ExportInitGenerator;