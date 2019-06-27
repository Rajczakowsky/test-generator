const favicon = require('serve-favicon');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const getEnv = require('@twigeducation/getenv');
const webpackStats = require('./webpack-stats.json');
const configuration = require('./configuration');

const mainChunk = webpackStats.chunks.main;
const vendorsChunk = webpackStats.chunks.vendors;
const mainScripts = mainChunk.filter(chunk => chunk.name.endsWith('.js'));
const vendorsScripts = vendorsChunk.filter(chunk => chunk.name.endsWith('.js'));

const NODE_ENV = getEnv('NODE_ENV', 'development');
const PORT = getEnv('PORT', 9000);

const app = express();

app.all('/health', (req, res) => {
    res.sendStatus(200);
});

app.use(morgan('common'));

app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));

if (NODE_ENV === 'production') {
    // Set secure headers
    const oneYear = 60 * 60 * 24 * 365;
    app.use(helmet({
        hsts: {
            maxAge: oneYear,
            includeSubDomains: false,
        },
    }));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/src'));

app.get('/*', (req, res) => {
    res.render('index.pug', {
        scripts: [
            ...vendorsScripts,
            ...mainScripts,
        ],
        configuration,
    });
});

app.listen(PORT, () => {
    console.log(`ts-accounts listening on port ${PORT}!`);
});
