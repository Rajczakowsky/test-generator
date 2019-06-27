const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');
const getEnv = require('@twigeducation/getenv');

config.mode = 'development';

config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
);

config.module.rules.push(
    {
        test: /font\.(js)$/,
        loader: [
            'css-loader',
            {
                loader: 'webfonts-loader',
                options: {
                    fontName: 'Icons',
                    files: ['../svg/*.svg'],
                    baseClass: 'icon',
                    classPrefix: 'icon-',
                    fileName: '[fontname].[hash].[ext]',
                    publicPath: 'http://localhost:10080/',
                },
            },
        ],
    },
);

config.devServer = {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    host: getEnv('LOCAL_IP', 'localhost'),
    port: 10080,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
};

config.devtool = 'cheap-module-eval-source-map';

config.output.filename = '[name].bundle.js';

config.output.publicPath = 'http://localhost:10080/';

module.exports = config;
