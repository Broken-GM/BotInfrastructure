#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/
git pull origin development
cd app
sudo npm i
sudo pm2 startOrReload ecosystem.config.cjs --update-env