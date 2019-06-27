#!/usr/bin/env node
/* eslint-disable */

const fs = require('fs');

function checkCommitStructure() {
    const commitRaw = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
    if (!commitRaw || commitRaw === '' || commitRaw === undefined) {
        return exitAndOutputErrors(0, [
            '\x1b[33mERROR:\x1b[0m --- No Commit message found! Is this a master build?',
            '\x1b[33mERROR:\x1b[0m --- Skipping check',
        ]);
    }
    const commit = commitRaw.filter(line => (line.replace(/\s/g, '')[0] !== '#')); // Remove commented out lines

    if (commit.length > 1 && commit[1] !== '') {
        return exitAndOutputErrors(1, [
            '\x1b[31mERROR:\x1b[0m Commit message and body must be separated by an empty line',
            '\x1b[31mERROR:\x1b[0m See https://github.com/TwigWorld/process-guides/blob/master/process-01-pull-request-review.md',
        ]);
    }
}

function checkCommitMessage() {
    const message = fs.readFileSync(process.argv[2], 'utf8')
        .split(/\r?\n/)
        .filter(line => line.replace(/\s/g, '')[0] !== '#')[0]; // Remove commented out lines

    if (message.length > 50) {
        return exitAndOutputErrors(1, [
            '\x1b[31mERROR:\x1b[0m Commit message must be 50 characters or less',
            '\x1b[31mERROR:\x1b[0m See https://github.com/TwigWorld/process-guides/blob/master/process-01-pull-request-review.md',
        ]);
    }

    if (message[0] && message[0] == message[0].toLowerCase()) {
        return exitAndOutputErrors(1, [
            '\x1b[31mERROR:\x1b[0m Commit message must begin with a capital letter',
            '\x1b[31mERROR:\x1b[0m See https://github.com/TwigWorld/process-guides/blob/master/process-01-pull-request-review.md',
        ]);
    }

    if (message[message.length - 1] === '.') {
        return exitAndOutputErrors(1, [
            '\x1b[31mERROR:\x1b[0m Commit message must not end with a period',
            '\x1b[31mERROR:\x1b[0m See https://github.com/TwigWorld/process-guides/blob/master/process-01-pull-request-review.md',
        ]);
    }
}

function checkCommitBody() {
    const body = getCommitMessageBody();

    body.forEach((line, i) => {
        if (line.replace(/\s/g, '')[0] !== '#') {
            if (line.length > 71) {
                return exitAndOutputErrors(1, [
                    '\x1b[31mERROR:\x1b[0m Commit body line must be 72 characters or less',
                    `\x1b[31mERROR:\x1b[0m Line ${i+1} is ${line.length} characters long`,
                    '\x1b[31mERROR:\x1b[0m See https://github.com/TwigWorld/process-guides/blob/master/process-01-pull-request-review.md',
                ])
            }
        }
    });
}

function exitAndOutputErrors(errorCode, messages) {
    const commitMessage = fs.readFileSync(process.argv[2], 'utf8')
        .split(/\r?\n/)
        .filter(line => line.replace(/\s/g, '')[0] !== '#')[0]; // Remove commented out lines

    messages.forEach(msg => console.log(msg));

    console.log('\x1b[33mINFO:\x1b[0m Your original commit message is below:')
    console.log('-----')
    console.log(commitMessage);
    console.log('-----')
    process.exit(errorCode);
}

function getCommitMessageBody() {
    return fs.readFileSync(process.argv[2], 'utf8')
        .split(/\r?\n/)
        .filter(line => (line.replace(/\s/g, '')[0] !== '#')); // Remove commented out lines
}

function checkCommit() {
    console.log('--- Checking commit message');
    checkCommitStructure();
    checkCommitMessage();
    checkCommitBody();

    process.exit(0);
}

checkCommit();
