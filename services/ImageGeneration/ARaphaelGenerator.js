const shortid = require('shortid');
const setup = require('./RaphaelSetup');

class ARaphaelGenerator {
    constructor(size, activity) {
        this.activity = activity;
        this.size = size;
        this.viewportSize = 500;
        this.id = shortid.generate();

        this.paper = setup.createNewPaper(this.id, size, size);
        this.paper.rect(0, 0, this.viewportSize, this.viewportSize).attr({ fill: 'none', stroke: '#000', 'stroke-width': 3 });
        this.paper.setViewBox(0, 0, this.viewportSize, this.viewportSize);
    }

    /**
     * Has to be overridden
     * Example Implementation
     */
    generate() {
        let paper = this.raphael(0, 0, 250, 250);
        paper.text('50%', 40, 'Some text').attr({
            fill: 'red',
            stroke: 'none'
        });
        paper.rect(10, 10, 230, 230, 50).attr({
            fill: '#000',
            stroke: 'none'
        });
        throw new Error('You have to implement the method parse');
    }

    toString() {
        let svg = global.document.getElementById(this.id).outerHTML;
        svg = svg.replace('<i title="Raphaël Colour Picker" style="display: none;"></i>', '');
        svg = svg.replace('<head></head><body>', '');
        svg = svg.replace('</body>', '');
        //console.log(svg);
        return svg;
    }

    toJSON() {
        let data = this.toString();
        return {
            name: this.activity.id,
            data: data
        };
    }
}

module.exports = ARaphaelGenerator;











