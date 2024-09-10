#!/bin/bash -ex
if [ ! -f ./ranInitialInstall.txt ]; then
    sudo -u ubuntu sh -c 'sudo apt update -y'
    sudo -u ubuntu sh -c 'sudo apt upgrade -y'
    sudo -u ubuntu sh -c 'sudo apt install -y curl'
    sudo -u ubuntu sh -c 'sudo apt install -y ffmpeg=7:4.4.2-0ubuntu0.22.04.1'
    sudo -u ubuntu sh -c 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -'
    sudo -u ubuntu sh -c 'sudo apt install -y nodejs'
    sudo -u ubuntu sh -c 'sudo npm install pm2 -g'
    sudo -u ubuntu sh -c 'sudo chmod +x ./deploy-development.sh'
    sudo -u ubuntu sh -c 'sudo chmod +x ./generate-ecosystem.sh'
    sudo -u ubuntu sh -c 'sudo chmod +x ./start-app.sh'
    sudo -u ubuntu sh -c 'sudo ./start-app.sh'
    sudo -u ubuntu sh -c 'touch ./ranInitialInstall.txt'
fi