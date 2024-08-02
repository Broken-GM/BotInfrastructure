import { SlashCommandBuilder } from 'discord.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

export default {
	data: new SlashCommandBuilder()
		.setName('create-campaign')
		.setDescription('Creates A campaign and associates it to this discord'),
	async execute(interaction) {
		const client = new DynamoDBClient({ region: 'us-west-2' })

		const getUserCommand = new GetCommand({
			TableName: 'users',
			Key: {
			  PK: `discord#${interaction.user.id}`
			},
		  })
		const getUserResponse = await client.send(getUserCommand)

		await interaction.reply({ content: `${JSON.parse(getUserResponse?.Item?.attributes ? getUserResponse?.Item?.attributes : "{}")}`, ephemeral: true });
	},
};