#!/bin/bash

# Set Docker environmental variables
$(boot2docker shellinit)

# Clone down the repository and install dependencies
git clone https://github.com/lifter-cli/lifter.git;
cd lifter && npm install;

# Install gulp and run gulp
npm install -g gulp;
cd lifter-ui;
gulp
