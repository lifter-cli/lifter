#!/bin/bash
git clone https://github.com/lifter-cli/lifter.git;
cd lifter && npm install;
npm install -g gulp;
cd lifter-ui;
gulp
