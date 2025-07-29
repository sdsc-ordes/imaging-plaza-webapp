'use strict';

const take = (array, param, n) => {
    const start = typeof n === 'number' ? param : 0;
    const count = typeof n === 'number' ? start + n : param;
    return array.slice(start, count);
};

const splitFilenameAndExtension = (fileName) => {
    const parts = fileName.split('.');
    if (parts.length === 1 || (parts.length === 2 && fileName.startsWith('.')))
        return [parts[0], ''];
    return [take(parts, parts.length - 2).join('.'), parts[parts.length - 1]];
};
const getFileExtension = (fileName) => {
    const [_, extension] = splitFilenameAndExtension(fileName);
    return extension;
};
const lookForFile = (files, fileName, options = { strict: true }) => {
    const [name, extension] = splitFilenameAndExtension(fileName);
    return files.find(f => {
        if (options?.strict)
            return f.name === fileName;
        if (!f.name.endsWith(extension))
            return false;
        return f.name.includes(name);
    });
};

async function readAndParseJsonFile(file, model) {
    var reader = new FileReader();
    const p = new Promise((res, rej) => {
        reader.onload = function (evt) {
            try {
                const valueAsString = evt.target?.result;
                const json = JSON.parse(valueAsString);
                const data = model.parse(json);
                res({ success: true, data });
            }
            catch (e) {
                if (e instanceof Error) {
                    res({ success: false, error: e });
                }
                else {
                    rej(e);
                }
            }
        };
        reader.onerror = function (evt) {
            rej(res({ success: false, error: new Error('Cannot read file') }));
        };
    });
    reader.readAsText(file, 'UTF-8');
    return p;
}
async function lookForAndParseFile(files, fileName, model, options = { strict: true }) {
    const file = lookForFile(files, fileName, options);
    if (!file)
        return { success: false, error: new Error(`cannot find ${fileName}`) };
    else {
        return readAndParseJsonFile(file, model);
    }
}

exports.getFileExtension = getFileExtension;
exports.lookForAndParseFile = lookForAndParseFile;
exports.lookForFile = lookForFile;
exports.readAndParseJsonFile = readAndParseJsonFile;
exports.splitFilenameAndExtension = splitFilenameAndExtension;
