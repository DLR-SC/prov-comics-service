const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Raphael = null;

function setupRaphael() {
    let dom = new JSDOM('<html><body></body></html>', { pretendToBeVisual: true });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.Image = global.window.Image;
    global.Node  = global.window.Node;
    Raphael = require('raphael');

    Raphael.setWindow(dom.window);
    console.log('Successful Raphael setup!');
}

function createNewPaper(id, height, width) {
    //let elm = global.document.createElement('DIV');
    //elm.setAttribute('id', id);
    //elm = global.document.body.appendChild(elm);

    let paper = Raphael(0, 0, width, height);
    paper.canvas.setAttribute('id', id);
    return paper;
}

module.exports.setupRaphael = setupRaphael;
module.exports.createNewPaper = createNewPaper;