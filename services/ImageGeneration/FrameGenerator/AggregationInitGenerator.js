const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');

class AggregationInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    //TODO: Implement multiple usage objs for aggregation
    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        let entities = [ new Entity(125, 215, 0.7, this.activity.usage.type, this.paper, false, false), new Entity(235, 215, 0.7, null, this.paper, false, false) ];
        entities.forEach(value => value.draw());

        Builder.buildPlus(this.paper);
        this.paper.rect(193, 320, 130, 30, 5).attr({ fill: '#fff', stroke: '#aaa' });
        this.paper.text(260, 169.5, 'Combine').attr({ fill: '#000', 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'middle' });


        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = AggregationInitGenerator;