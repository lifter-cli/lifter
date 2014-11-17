[![Stories in Ready](https://badge.waffle.io/lifter-cli/lifter.svg?label=ready&title=Ready)](http://waffle.io/lifter-cli/lifter)
[![Build Status](https://travis-ci.org/lifter-cli/lifter.svg?branch=master)](https://travis-ci.org/lifter-cli/lifter)
[![Coverage Status](https://coveralls.io/repos/hrdocker/hrdocker/badge.png)](https://coveralls.io/r/hrdocker/hrdocker)

Lifter
========
Lifter is a command line tool that simplifies and automates deployment with Docker containers. Our tool is designed with Mac OS X as the local development environment. Modifications can be made to use this tool in other environments as well.

## Requirements
- Install the Docker and Boot2Docker package (lightweight Linux VM to run the Docker server) - [Download at the official Docker site](https://github.com/boot2docker/osx-installer/releases/latest)
- [Create a Docker Hub account](https://hub.docker.com/account/signup/) (free), which is the equivalent of GitHub for the Docker world

## Getting Started
0. Make sure you meet the requirements before moving on to the next steps. 
1. Install our command line tool via NPM as a global module so you can access it via the command line:
```
npm install -g lifter
```
2. Run the `lifter` command to receive an overview of the four main Lifter commands.
3. Run the `lifter config` command to configure the settings for your Docker containers.
4. Run the `lifter init` command to start up your development environment with Docker containers
5. Run the `lifter push` command to ...
6. Run the `lifter deploy` command to ..
7. Your containers are now up and running in both your development and production environments. You can monitor the status of your containers through our Lifter UI by going to `http://localhost:####/`

## Indepth Guide of How Lifter Works

### Lifter Config

### Lifter Init

### Lifter Push

### Lifter Deploy

## FAQ
Q:Can I use Lifter to deploy to AWS, Google, [insert favorite cloud service provider]?
A: We currently support deployment to Microsoft Azure and may support other cloud service providers in the future. 

## Team

  - __Product Owner__: Will Chen
  - __Scrum Master__: Urvashi Reddy
  - __Development Team Members__: Will Chen, Urvashi Reddy, Jason Erpenbeck, Greg Ferrell

