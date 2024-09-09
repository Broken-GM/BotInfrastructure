#!/bin/bash -ex
cd ../../
git pull origin development
cd app
sudo npm i
sudo node app/deployment/henerateEcosystem.js
sudo pm2 startOrReload ecosystem.config.cjs --update-env