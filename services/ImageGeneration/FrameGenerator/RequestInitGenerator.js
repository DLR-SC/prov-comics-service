const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');

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

        if(this.mode === modes.DOWNLOAD) {
            Builder.buildEntity(this.paper, 420, 140, 0.5);
            Builder.buildEmptyEntity(this.paper, 155, 200);
        } else if(this.mode === modes.UPLOAD) {
            Builder.buildEntity(this.paper, 150, 185, 1.0);
        }

        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });
    }

}

module.exports = RequestInitGenerator;
module.exports.modes = modes;