const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './output/';

let writeComicToDisk = async function(comic) {
    await cleanDir(OUTPUT_DIR);
    let idx = 1;
    for (let seq of comic) {
        await writeSequenceToDisk(seq, false, idx++);
    }
};

let writeSequenceToDisk = async function(sequence, clean, order) {
    if(clean)
        await cleanDir(OUTPUT_DIR);

    let idx = 1;
    sequence.data.forEach((frame) => {
        let filename = `frame_${sequence.name.split(':')[1]}_${order}_${idx++}.svg`;
        let path = OUTPUT_DIR + filename;
        fs.writeFile(path, frame, (err) => {
            if (err) throw err;
            console.log(`${filename} has been saved!`);
        });
    });
};

function cleanDir(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(dir, file), err => {
                    if (err) reject(err);
                    resolve();
                });
            }
            resolve();
        });
    });
}

exports.writeSequenceToDisk = writeSequenceToDisk;
exports.writeComicToDisk = writeComicToDisk;
