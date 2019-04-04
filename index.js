// const path = require('path');

// let jsonpName = (fileName) => {
//     return fileName.replace(/-|(__\w+)/g, '');
// }

class TransferToCMD {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'transter-to-cmd',
            (compilation, callback) => {
                let assets = compilation.assets;

                if (!Object.keys(assets)) {
                    callback();
                    return;
                }

                Object.keys(assets).forEach((fileName) => {
                    let asset = assets[fileName],
                        source = asset.source();

                    if (!/\.js$/.test(fileName)) {
                        return;
                    }

                    // let replaceJsonp = `webpackJsonp${path.dirname(jsonpName(fileName)).split('/').pop()}`;

                    // source = source.replace(/webpackJsonpdefault/g, replaceJsonp)
                    //     .replace(/"\$publicPath\$"/g, 'publicPath + "/"');


                    // if (/(hot-update)\//.test(fileName)) {
                    //     assets[fileName] = {
                    //         source: () => source,

                    //         size: () => source.length
                    //     }

                    //     return;
                    // }

                    let cmdSource = `define(function(require, exports, module){\n${source}\n})`;

                    assets[fileName] = {
                        source: () => cmdSource,

                        size: () => cmdSource.length
                    }
                });

                callback();
            }
        )
    }
}

module.exports = TransferToCMD;