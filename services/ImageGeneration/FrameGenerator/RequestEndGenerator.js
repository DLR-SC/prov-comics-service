const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

const modes = {
    'UPLOAD': 0,
    'DOWNLOAD': 1
};

class RequestEndGenerator extends AGenerator {
    constructor(activity, size) {
        super(size);
        this.activity = activity;
        if(activity.type.toLowerCase().includes('upload'))
            this.mode = modes.UPLOAD;
        else
            this.mode = modes.DOWNLOAD;
    }

    generate() {
        Builder.buildSmartphone(this.paper, this.activity.software.label, -50);
        Builder.buildOrganization(this.paper, this.activity.organization.label);

        Builder.buildEntity(this.paper, 150, 185, 1.0);
        Builder.buildEntity(this.paper, 420, 140, 0.5);
        Builder.buildCheck(this.paper, 180, 310);

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = RequestEndGenerator;
module.exports.modes = modes;