#!/bin/bash

echo "Testing docker ps inside vm"
sudo docker -d \&
sudo docker ps -a
