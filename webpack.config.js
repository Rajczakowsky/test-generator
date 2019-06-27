const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const configuration = require('./configuration');

const config = {
    output: {
        publicPath: '/',
        filename: '[name].bundle.[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    cache: true,
    stats: {
        errorDetails: true,
    },
    entry: {
        main: [
            'babel-polyfill',
            './src/js/index',
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            'path-to-regexp': path.resolve(
                __dirname, 'node_modules', 'react-router', 'node_modules', 'path-to-regexp',
            ),
        },
    },
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules/,
                    /\.test\.(js|jsx)$/,
                ],
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
            },
            {
                test: /\.(otf|woff|eot|ttf|mp3|png|svg|gif|jpg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].asset.[hash].[ext]',
                    },
                }],
            },
            {
                test: /\.pug$/,
                use: [
                    { loader: 'raw-loader' },
                    {
                        loader: 'pug-html-loader',
                        options: {
                            data: {
                                configuration,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            favicon: './favicon/favicon.ico',
            chunksSortMode: 'none',
        }),
        new CopyWebpackPlugin([
            {
                from: 'favicon',
                to: path.resolve(__dirname, 'dist'),
            },
        ]),
    ],
};

module.exports = config;
