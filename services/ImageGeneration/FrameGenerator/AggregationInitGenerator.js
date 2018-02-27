const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

class AggregationInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size);
        this.activity = activity;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        Builder.buildEntity(this.paper, 215, 125, 0.7);
        Builder.buildEntity(this.paper, 215, 235, 0.7);

        Builder.buildPlus(this.paper);
        this.paper.rect(193, 320, 130, 30, 5).attr({ fill: '#fff', stroke: '#aaa' });
        this.paper.text(260, 169.5, 'Combine').attr({ fill: '#000', 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'middle' });


        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = AggregationInitGenerator;