const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Setup = require('./RaphaelSetup');
const shortid = require('shortid');

function copyElm(orig, dest, elm, x, y) {
    let type = elm.type;
    let attrs = elm.attrs;
    let transform = elm.matrix.split();

    //console.log('Info ' + type + '> ', elm.matrix.split());

    let paper = dest;
    let newElm = paper[type]();
    newElm.attr(attrs);
    //newElm.matrix.translate(transform.dx * (1 / transform.scalex), transform.dy * (1 / transform.scaley));
    newElm.translate(transform.dx, transform.dy);
    newElm.translate(x, y);
    newElm.scale(transform.scalex, transform.scaley, 0, 0);
    //newElm.transform(`T${x},0...`);
    return newElm;
}

class SequenceConcater {
    constructor(generators, size) {
        this.size = size;
        this.generators = generators;
        this.width = Math.max(...generators.map(o => o.length));
        this.height = generators.length;

        this.id = shortid.generate();
        
        this.paper = Setup.createNewPaper(this.id, size * this.height, size * this.width);
        this.paper.setViewBox(0, 0, 500 * this.width, 500 * this.height);

    }
	
    generate() {
        let xIdx = 0;
        let yIdx = 0;
        for(let seqId in this.generators) {
            let seq = this.generators[seqId];
            let y = this.size * yIdx;
            xIdx = 0;
            for(let frame of seq) {
                console.log(`Size: (${this.width * this.size}|${this.height * this.size}), Pos: (${this.size * xIdx}|${this.size * yIdx})`);
                let x = this.size * xIdx;
                let paper = this.paper;
            
                frame.paper.forEach(elm => {
                    copyElm(frame.paper, paper, elm, x, y);
                });
                xIdx++;
            }
            yIdx++;
        }
        console.log('Processed frames: ', xIdx);
    }
	
    toString() {
        let svg = global.document.getElementById(this.id).outerHTML;
        svg = svg.replace('<i title="Raphaël Colour Picker" style="display: none;"></i>', '');
        svg = svg.replace('<head></head><body>', '');
        svg = svg.replace('</body>', '');
        //console.log(svg);
        return svg;
    }
}

module.exports = SequenceConcater;