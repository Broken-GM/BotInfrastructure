#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/app
sudo touch ecosystem.config.cjs
echo "module.exports = {apps : [{name: 'Broken GM',script: 'index.js',max_memory_restart: '256M',env: {DISCORD_TOKEN: '$1',DISCORD_CLIENT_ID: '$2',NUMBER_OF_CLUSTERS: '$3',CLUSTER_INDEX: '$4'}}]}" | sudo tee ecosystem.config.cjs