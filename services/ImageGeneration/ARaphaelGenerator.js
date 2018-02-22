const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class ARaphaelGenerator {
    constructor(size) {
        this.size = size;
        this.viewportSize = 500;
        this.dom = new JSDOM('<html></html>', { pretendToBeVisual: true });
        this.window = this.dom.window;

        global.window = this.window;
        global.document = this.window.document;

        global.navigator = this.window.navigator;
        this.raphael = require('raphael');
        this.raphael.setWindow(this.window);

        this.paper = this.raphael(0, 0, this.size, this.size);
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
        let svg = this.window.document.documentElement.innerHTML;
        svg = svg.replace('<head></head><body>', '');
        svg = svg.replace('</body>', '');
        //console.log(svg);

        return svg;
    }
}

module.exports = ARaphaelGenerator;











