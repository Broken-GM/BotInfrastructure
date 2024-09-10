#!/bin/bash -ex
cd ../../
git pull origin development
cd app
sudo npm i
sudo node deployment/generateEcosystem.js
sudo pm2 startOrReload ecosystem.config.cjs --update-env