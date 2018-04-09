const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');

class ExportEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    //TODO: Replace Data Entity
    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        new Entity(175, 225, 1.0, this.activity.created.type, this.paper, false, false, true).draw();
        //Builder.buildDataEntity(this.paper);
        Builder.buildCheck(this.paper, 230, 300);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = ExportEndGenerator;