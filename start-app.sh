#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/app
sudo npm i
sudo pm2 start ecosystem.config.cjs
sudo pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup ubuntu -u ubuntu --hp /home/ubuntu