#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/app
sudo npm i
sudo pm2 start ./index.js