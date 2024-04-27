#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/app
sudo npm i
sudo pm2 start ecosystem.config.js
sudo pm2 save
pm2 startup ubuntu