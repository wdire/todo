const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const devMode = process.env.node_env === "development" ? "source-map" : "";

module.exports = {
    mode: "none",
    output: {
        filename: 'app.js',
    },
    devtool: devMode,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
   },
   optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                mangle: {
                    toplevel: true,
                },
                allowEmpty: true
            },
        })],
  },
  stats: 'errors-warnings'
};
