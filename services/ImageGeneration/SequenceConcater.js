const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Setup = require('./RaphaelSetup');
const shortid = require('shortid');

function copyElm(orig, dest, elm, x) {
    let type = elm.type;
    let attrs = elm.attrs;
    let transform = elm.matrix.split();

    //console.log('Info ' + type + '> ', elm.matrix.split());

    let paper = dest;
    let newElm = paper[type]();
    newElm.attr(attrs);
    //newElm.matrix.translate(transform.dx * (1 / transform.scalex), transform.dy * (1 / transform.scaley));
    newElm.translate(transform.dx, transform.dy);
    newElm.translate(x);
    newElm.scale(transform.scalex, transform.scaley, 0, 0);
    //newElm.transform(`T${x},0...`);
    return newElm;
}

class SequenceConcater {
    constructor(sequence, size) {
        this.size = size;
        this.sequence = sequence;
        this.viewportHeight = 500;
        this.viewportWidth = 500 * sequence.length;

        this.id = shortid.generate();
        
        this.paper = Setup.createNewPaper(this.id, size, size * sequence.length);
        this.paper.setViewBox(0, 0, this.viewportWidth, this.viewportHeight);

    }
	
    generate() {
        let index = 0;
        for(let frame of this.sequence) {
            console.log(`Size: ${this.size}, X: ${this.size * index}`);
            let x = this.size * index;
            let paper = this.paper;
            let set = paper.set();
          
            frame.paper.forEach(elm => {
                let newElm = copyElm(frame.paper, paper, elm, x);
                //set.push(elm);
                
                //console.log('Before: ', elm.matrix.split());
                //console.log('After: ', newElm.matrix.split());
                
                //newElm.transform('t'+ x + ',0...');
            });
            //set.transform('...T' + 0 + ',0');
            index++;
        }
        console.log('Processed frames: ', index);
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

module.exports = SequenceConcater;