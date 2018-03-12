const AGenerator = require('../ARaphaelGenerator');
const Builder = require('../ElementBuilder');
const moment = require('moment');

class IntroGenerator extends AGenerator {
    constructor(activity, size) {
        super(size, activity);
    }

    generate() {
        let dateTime = moment(this.activity.startTime);
        let date = dateTime.format('Do MMMM YYYY');
        let time = dateTime.format('H:mm');

        //Header line
        this.paper.path('M0,40H500Z').attr({ fill: 'none', stroke: '#000', 'stroke-width': 2 });
        this.paper.text(10, 13, 'On  ' + date + ' at ' + time).attr({ 'font-size': 12, 'text-anchor': 'start', 'font-weight': 'bold' });
        this.paper.text('97%', 13, this.activity.id.split(':')[1].toUpperCase()).attr({ 'font-size': 13, 'font-weight': 'bold', fill: '#ff5415', 'text-anchor': 'end' });

        //Name Texts
        let label = this.activity.owner.label ? this.activity.owner.label : this.activity.software.label;
        this.paper.text('50%', '95%', label).attr({ 'font-size': 13, 'font-weight': 'bold' });

        Builder.buildSmartphoneUser(this.paper, label);
    }
}

module.exports = IntroGenerator;