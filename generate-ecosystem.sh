#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/app
sudo touch ecosystem.config.js
echo "const ecosystem = {apps : [{name: 'Broken GM',script: 'index.js',max_memory_restart: '256M',env: {DISCORD_TOKEN: '$1',DISCORD_CLIENT_ID: '$2'}}]}\n export default ecosystem" | sudo tee ecosystem.config.js