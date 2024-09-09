import { ShardingManager } from 'discord.js'
import dotenv from 'dotenv'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
dotenv.config();

const client = new SecretsManagerClient({ region: 'us-west-2' });
const secretResponse = await client.send(
	new GetSecretValueCommand({
		SecretId: process.env.BOT_SECRET_ARN,
	}),
);
const parsedResponse = JSON.parse(secretResponse.SecretString)

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
    token: parsedResponse?.token, 
    mode: "worker",
    respawn: true,
    totalShards, 
    shardList
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();