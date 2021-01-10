const { dirname } = require("path");

module.exports = {
    entry: {
        app: './src/js/app.js',
    },
    output: {
        filename: "[name].bundle.js",
        path: `${__dirname}/dist/public/js/`
    }
}
