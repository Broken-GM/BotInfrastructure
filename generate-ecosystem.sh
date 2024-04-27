#!/bin/bash -ex
cd ../../../../home/ubuntu/Bot/
touch ecosystem.config.js
echo "module.exports = {apps : [{name: 'Broken GM Bot - Main',script: 'app/index.js',max_memory_restart: '256M',env: {DISCORD_TOKEN: '$1',DISCORD_CLIENT_ID: '$2'}}]}" | tee ecosystem.config.js