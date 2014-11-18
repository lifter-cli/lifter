#!/bin/bash
# check if docker is installed in vm (sudo docker -v)
# set up daemon correctly, account for azure bugs

echo "Pulling image from DockerHub"
docker pull dockerRepoName

echo "Starting a mongo container"
docker run --restart=always -d --name db mongo:latest

echo "Creating application container"
echo "Linking to mongo container"
echo "Running application script"
docker run --restart=always -i -t -p 80:9000 --link db:dbLink dockerRepoName sh prod/src/app.sh

echo "Your application is deployed at: http://Cloud-service-name:80"