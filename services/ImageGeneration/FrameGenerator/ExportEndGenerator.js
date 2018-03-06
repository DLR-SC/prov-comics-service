const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class ExportEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildDataEntity(this.paper);
        Builder.buildCheck(this.paper, 230, 300);

        this.paper.text(260, 130, '.' + this.activity.created.type).attr({ fill: '#454545', 'font-size': 13, 'font-weight': 'bold', 'text-anchor': 'middle' });
        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = ExportEndGenerator;