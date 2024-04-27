import { ShardingManager } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config();

const manager = new ShardingManager('./bot.js', { 
    token: process.env.DISCORD_TOKEN, 
    totalShards: 10, 
    shardList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] 
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();