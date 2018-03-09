const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const Entity = require('../Entity');

const modes = {
    'UPLOAD': 0,
    'DOWNLOAD': 1
};

class RequestInitGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
        let type = activity.type;
        if(type && type.toLowerCase().includes('upload'))
            this.mode = modes.UPLOAD;
        else
            this.mode = modes.DOWNLOAD;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label, -50);
        Builder.buildOrganization(this.paper, this.activity.organization.label);

        let entities = null;
        if(this.mode === modes.DOWNLOAD) {
            entities = [ new Entity(140, 420, 0.5, this.activity.usage.type, this.paper, false, false), new Entity(200, 155, 1.0, null, this.paper, true, false) ];
        } else if(this.mode === modes.UPLOAD) {
            entities = [ new Entity(185, 150, 1.0, this.activity.usage.type, this.paper, false, false) ];
        }

        entities.forEach((value) => value.draw());

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = RequestInitGenerator;
module.exports.modes = modes;