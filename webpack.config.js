const { dirname } = require("path");

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: `${__dirname}/dist/public/js/`,
        filename: "bundle.js"
    }
}