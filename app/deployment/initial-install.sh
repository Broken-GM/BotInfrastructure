#!/bin/bash -ex
if [ ! -f ./home/ubuntu/Bot/deployment/checks/ranInitialInstal.txt ]; then
    sudo -u ubuntu sh -c 'sudo apt update -y'
    sudo -u ubuntu sh -c 'sudo apt upgrade -y'
    sudo -u ubuntu sh -c 'sudo apt install -y curl'
    sudo -u ubuntu sh -c 'sudo apt install -y ffmpeg=7:4.4.2-0ubuntu0.22.04.1'
    sudo -u ubuntu sh -c 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -'
    sudo -u ubuntu sh -c 'sudo apt install -y nodejs'
    sudo -u ubuntu sh -c 'sudo npm install pm2 -g'
    sudo -u ubuntu sh -c 'sudo git clone https://github.com/Broken-GM/Bot.git ./home/ubuntu/Bot'
    sudo -u ubuntu sh -c 'git config --global --add safe.directory ./home/ubuntu/Bot'
    sudo -u ubuntu sh -c 'sudo chmod +x ./home/ubuntu/Bot/deployment/deploy-development.sh'
    sudo -u ubuntu sh -c 'sudo chmod +x ./home/ubuntu/Bot/deployment/generate-ecosystem.sh'
    sudo -u ubuntu sh -c 'sudo chmod +x ./home/ubuntu/Bot/deployment/start-app.sh'
    sudo -u ubuntu sh -c 'sudo mkdir ./home/ubuntu/Bot/deployment/checks'
    sudo -u ubuntu sh -c 'sudo ./home/ubuntu/Bot/start-app.sh'
    sudo -u ubuntu sh -c 'sudo touch ./home/ubuntu/Bot/deployment/checks/ranInitialInstall.txt'
fi