[![Stories in Ready](https://badge.waffle.io/lifter-cli/lifter.svg?label=ready&title=Ready)](http://waffle.io/lifter-cli/lifter)
[![Build Status](https://travis-ci.org/lifter-cli/lifter.svg?branch=master)](https://travis-ci.org/lifter-cli/lifter)
[![Coverage Status](https://coveralls.io/repos/hrdocker/hrdocker/badge.png)](https://coveralls.io/r/hrdocker/hrdocker)

Lifter
========
Lifter is a command line tool that simplifies and automates deployment with Docker containers. Our tool is designed for software developers that use Mac OS X and have heard of Docker containers and would like to get up and running as soon as possible. 

While Docker containers can dramatically improve the predictability of deploying your application, using Docker has a steep learning curve. We have reduced the complexity of using Docker by designing a generalized Docker workflow that fits most use cases of web application development. 

Even for familiar users of Docker, our tool is designed to reduce your time managing your containers by eliminating the need to execute a series of Docker commands as part of your typical development workflow.

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
4. Run the `lifter init` command to start the Docker containers in your local dev environment
5. Run the `lifter push` command to save the state of your application as a Docker image and push it to Docker Hub
6. Run the `lifter deploy` command to deploy your application on a VM in your production environment
7. Your containers are now up and running in both your development and production environments. You can monitor the status of your containers through our Lifter UI by going to `http://localhost:####/`

## Indepth Guide of How Lifter Works
This section explains what exactly is happening under the hood with each Lifter command.

### Lifter Config
This prompts the user to answer a series of questions that are used in Lifter Init to setup the containers in the local dev environment. The output of this command is the `lifter.yaml` file which is read by the next step.

### Lifter Init
This will start the Docker server in your local dev environment (Mac OS X) by starting Boot2Docker, which is a lightweight Linux VM that allows you to run the Docker server because it cannot natively run on OS X (although the Docker client can run natively in in the OS X terminal).

Lifter then starts an application container that is linked to a folder with your codebase and a database container that is linked to your application container. Now you can make changes to your codebase as you normally do in your text editor / IDE and the changes will automatically be synced to the application container. This enables you to test and run your application in a Docker container that will mimic your production environment. We do this by using a feature in Docker called mounted volumes which allows you to select a directory (in this case, a local directory with your application code) and have that directory and its contents directly exposed to the container. In other words, the container has a reference to your application code, which allows it to always your container to be synced with the codebase on your computer.

### Lifter Push
This saves the state of your application into a Docker image and then pushes this Docker image to Docker Hub. This workflow mirrors the Git workflow where you commit your changes and push to a remote repository on Git Hub. 

### Lifter Deploy
Once you are ready to deploy your application, you can either choose to create a new VM or use an existing VM on Azure to deploy to. This will copy and execute a shell script that will replicate a set-up similar to your development environment and start your application and database containers. The shell script automatically executes the launch command that you specified in the lifter config stage, which will then start the server for your app.

## FAQ
Q: Can I use Lifter to deploy to AWS, Google, [insert favorite cloud service provider]?
A: We currently support deployment to Microsoft Azure and may support other cloud service providers in the future.  The first three Lifter commands (config, init, and push) are applicable to deployments in any production environment and with some customization of the lifter deploy steps, our tool can be used to deploy to other cloud service providers.

## Team

  - __Product Owner__: Will Chen
  - __Scrum Master__: Urvashi Reddy
  - __Development Team Members__: Will Chen, Urvashi Reddy, Jason Erpenbeck, Greg Ferrell

