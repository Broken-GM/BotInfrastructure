import { ShardingManager } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config();

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

const numberOfShardsPerCluster = 10
const totalShards = process.env.NUMBER_OF_CLUSTERS * numberOfShardsPerCluster
const shardList = range(
    numberOfShardsPerCluster, 
    (process.env.CLUSTER_INDEX * numberOfShardsPerCluster) - numberOfShardsPerCluster
)

const manager = new ShardingManager('./bot.js', { 
    token: process.env.DISCORD_TOKEN, 
    mode: "worker",
    respawn: true,
    totalShards, 
    shardList
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();