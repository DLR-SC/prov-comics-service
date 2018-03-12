const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');

class AggregationEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildCheck(this.paper, 220, 300);
        let types = [this.activity.usage.type, null];
        new Entity(160, 195, 1.1, types, this.paper, false, true).draw();
        //Builder.buildSplitEntity(this.paper);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = AggregationEndGenerator;