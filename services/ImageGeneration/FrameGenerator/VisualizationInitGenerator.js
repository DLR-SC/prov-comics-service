const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');

class VisualizationInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label);
        let entity = new Entity(170, 200, 1.0, this.activity.usage.type, this.paper, false, false);
        entity.draw();

        this.paper.rect(193, 320, 130, 30, 5).attr({ fill: '#fff', stroke: '#aaa' });
        this.paper.text(260, 169.5, 'Visualize Data').attr({ fill: '#000', 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'middle' });

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = VisualizationInitGenerator;