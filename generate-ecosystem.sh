#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/
sudo touch ecosystem.config.js
echo "module.exports = {apps : [{name: 'Broken GM',script: 'index.js',max_memory_restart: '256M',env: {DISCORD_TOKEN: '$1',DISCORD_CLIENT_ID: '$2'}}]}" | sudo tee ecosystem.config.js