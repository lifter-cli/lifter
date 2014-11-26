#!/bin/bash

# Switch to sudo user - this may require a prompt
sudo su

# Install node properly
apt-get --purge -y remove node
apt-get --purge -y remove nodejs
apt-get install -y nodejs

# Install npm
apt-get install -y npm

# Set Docker environmental variables
export DOCKER_MONITOR_CA_PATH=/etc/docker.io/ca.pem
export DOCKER_MONITOR_CERT_PATH=/etc/docker.io/server-cert.pem
export DOCKER_MONITOR_KEY_PATH=/etc/docker.io/server-key.pem
export DOCKER_MONITOR_HOST_IP=0.0.0.0
export AZURE_UBUNTU=true

# Clone down the repository and install dependencies
git clone https://github.com/lifter-cli/lifter.git;
cd lifter && npm install;

# Install gulp and run gulp
npm install -g gulp;
cd lifter-ui;
gulp
