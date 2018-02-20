const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class ARaphaelGenerator {
    constructor() {
        let dom = new JSDOM('<html></html>', { pretendToBeVisual: true });
        this.window = dom.window;
        global.window = this.window;
        global.document = this.window.document;
        global.navigator = this.window.navigator;
        this.raphael = require('raphael');
        this.raphael.setWindow(this.window);
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











