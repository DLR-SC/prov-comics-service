const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');
const Device = require('../Device');

class ExportActionGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        //Builder.buildSmartphone(this.paper, this.activity.software.label);
        let device = new Device(0, 0, 1.0, this.paper, this.activity.software.device, this.activity.software.label);      
        let entity = new Entity(170, 200, 1.0, this.activity.usage.type, this.paper, false, false);
        entity.draw();
        device.draw();

        this.paper.rect(193, 320, 130, 30, 5).attr({ fill: '#fff', stroke: '#aaa' });
        this.paper.text(260, 169.5, 'Visualize Data').attr({ fill: '#000', 'font-size': 12, 'font-weight': 'bold', 'text-anchor': 'middle' });

        //Builder.buildFingerPress(this.paper);
        device.press();

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = ExportActionGenerator;