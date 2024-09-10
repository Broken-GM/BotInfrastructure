import fs from 'node:fs';
import path from 'node:path';
import { Events } from 'discord.js';
import { Player } from 'discord-player';
import { fileURLToPath } from 'url';
import { YoutubeiExtractor } from "discord-player-youtubei"
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new SecretsManagerClient({ region: 'us-west-2' });
const secretResponse = await client.send(
	new GetSecretValueCommand({
		SecretId: process.env.BOT_SECRET_ARN,
	}),
);
const parsedResponse = JSON.parse(secretResponse.SecretString)

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const player = new Player(client);
		await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
		await player.extractors.register(YoutubeiExtractor, {
			authentication: parsedResponse?.youtubeToken
		})

		client.player = player;

		const playerEventsPath = path.join(__dirname, 'player');
		const playerEventFiles = fs.readdirSync(playerEventsPath).filter(file => file.endsWith('.js'));

		for (const file of playerEventFiles) {
			const filePath = path.join(playerEventsPath, file);
			const event = (await import(filePath)).default;
			client.player.events.on(event.name, (...args) => event.execute(...args));
		}

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};