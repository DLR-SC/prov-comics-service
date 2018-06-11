const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');
const Device = require('../Device');

const modes = {
    'UPLOAD': 0,
    'DOWNLOAD': 1
};

class RequestActionGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
        let type = activity.type;
        if(type && type.toLowerCase().includes('upload'))
            this.mode = modes.UPLOAD;
        else
            this.mode = modes.DOWNLOAD;
    }

    generate() {
        //Builder.buildSmartphone(this.paper, this.activity.software.label, -50);
        new Device(0, -50, 1.0, this.paper, this.activity.software.device, this.activity.software.label).draw();
        Builder.buildOrganization(this.paper, this.activity.organization.label);

        let entities = null;
        if(this.mode === modes.DOWNLOAD) {
            Builder.buildDownstream(this.paper);
            Builder.buildCloud(this.paper, 'Downloading...');
            entities = [ new Entity(140, 420, 0.5, this.activity.usage.type, this.paper, false, false), new Entity(255, 370, 0.4, this.activity.usage.type, this.paper, false, false)]
        } else if(this.mode === modes.UPLOAD) {
            Builder.buildUpstream(this.paper);
            Builder.buildCloud(this.paper, 'Uploading...');
            entities = [ new Entity(255, 370, 0.4, this.activity.usage.type, this.paper, false, false) ];
        }

        entities.forEach((value) => value.draw());

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = RequestActionGenerator;
module.exports.modes = modes;