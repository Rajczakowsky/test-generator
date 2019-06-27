const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const config = require('./webpack.config');
const getEnv = require('@twigeducation/getenv');

const ENABLE_S3 = getEnv('ENABLE_S3', false);

config.devtool = 'source-map';
config.mode = 'production';

config.plugins.push(
    new CleanWebpackPlugin(['dist']),
);

config.plugins.push(
    new webpack.HashedModuleIdsPlugin(),
);

config.plugins.push(
    new BundleTracker({
        path: __dirname,
        filename: './webpack-stats.json',
    }),
);

if (ENABLE_S3) {
    const AWS_ACCESS_KEY_ID = getEnv('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_ACCESS_KEY = getEnv('AWS_SECRET_ACCESS_KEY');
    const AWS_CLOUDFRONT_URL = getEnv('AWS_CLOUDFRONT_URL');
    const AWS_LOCATION = getEnv('AWS_LOCATION');
    const AWS_S3_BUCKET = getEnv('AWS_S3_BUCKET');
    const AWS_S3_REGION = getEnv('AWS_S3_REGION');

    const publicPath = `${getEnv('AWS_CLOUDFRONT_URL')}/${getEnv('AWS_LOCATION')}/`;
    config.output.publicPath = publicPath;

    config.module.rules.push(
        {
            test: /font\.(js)$/,
            loader: [
                'style-loader',
                'css-loader',
                {
                    loader: 'webfonts-loader',
                    options: {
                        fontName: 'Icons',
                        files: ['../svg/*.svg'],
                        baseClass: 'icon',
                        classPrefix: 'icon-',
                        fileName: '[fontname].[hash].[ext]',
                        publicPath,
                    },
                },
            ],
        },
    );

    config.plugins.push(
        new S3Plugin({
            s3Options: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
                region: AWS_S3_REGION,
            },
            s3UploadOptions: {
                Bucket: AWS_S3_BUCKET,
                CacheControl: 'max-age=31104000',
            },
            cdnizerOptions: {
                defaultCDNBase: AWS_CLOUDFRONT_URL,
            },
            basePathTransform() { return AWS_LOCATION; },
        }),
    );
}


module.exports = config;
