const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const DocumentModel = new JSDOM('<html></html>', { pretendToBeVisual: false });
global.window = DocumentModel.window;
global.document = DocumentModel.window.document;
global.navigator = DocumentModel.window.navigator;
const Raphael = require('raphael');
Raphael.setWindow(DocumentModel.window);

(function (R) {
    var cloneSet; // to cache set cloning function for optimisation
    R.el.cloneToPaper = function (targetPaper) {
        return (!this.removed &&
            targetPaper[this.type]().attr(this.attr()));
    };

    R.st.cloneToPaper = function (targetPaper) {
        targetPaper.setStart();
        this.forEach(cloneSet || (cloneSet = function (el) {
            el.cloneToPaper(targetPaper);
        }));
        return targetPaper.setFinish();
    };
}(Raphael));

class SequenceConcater {
	constructor(sequence, size) {
		this.size = size;
        this.sequence = sequence;
        this.viewportHeight = 500;
        this.viewportWidth = 500 * sequence.length;

        this.paper = Raphael(0, 0, size * sequence.length, size);
        //this.paper.rect(0, 0, this.viewportSize, this.viewportSize).attr({ fill: 'none', stroke: '#000', 'stroke-width': 3 });
        this.paper.setViewBox(0, 0, this.viewportWidth, this.viewportHeight);   
    }
	
	generate() {
		let index = 0;
		for(let frame of this.sequence) {
			console.log(`Size: ${this.size}, X: ${this.size * index}`);
			let st = frame.paper.set();
			let x = this.size * index;
			frame.paper.forEach(elm => {
				//console.log(elm);
				elm.cloneToPaper(this.paper);
				elm.transform(`T${x},0`)
			});
			index++;
		}
		console.log('Processed frames: ', index);
	}
	
	toString() {
        let svg = global.document.documentElement.innerHTML;
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