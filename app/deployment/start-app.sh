#!/bin/bash -ex
if [ ! -f ./checks/ranStartApp.txt ]; then
    cd ..
    sudo npm i
    sudo node deployment/generateEcosystem.js
    sudo pm2 start ecosystem.config.cjs
    sudo pm2 save
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup ubuntu -u ubuntu --hp /home/ubuntu
    sudo touch ./deployment/ranStartApp.txt
fi