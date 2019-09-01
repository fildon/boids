const path = require('path');

module.exports = {
    entry: './dist/src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve()
    }
};
