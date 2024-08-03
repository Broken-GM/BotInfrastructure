import { SlashCommandBuilder } from 'discord.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid';

export default {
	data: new SlashCommandBuilder()
		.setName('create-campaign')
		.setDescription('Creates A campaign and associates it to this discord')
		.addStringOption(option =>
			option
				.setName('name')
				.setRequired(true)
				.setDescription('The name you want to give the campaign')),
	async execute(interaction) {
		const campaignName = interaction.options.getString('name', true);
		const client = new DynamoDBClient({ region: 'us-west-2' })

		const getUserCommand = new GetCommand({
			TableName: 'users',
			Key: {
				PK: 'user',
			  	SK: `discord#${interaction.user.id}`
			},
		})
		const getUserResponse = await client.send(getUserCommand)

		const userId = JSON.parse(getUserResponse?.Item?.attributes ? getUserResponse?.Item?.attributes : "{}")?.id
		let userAttributes = JSON.parse(getUserResponse?.Item?.attributes ? getUserResponse?.Item?.attributes : "{}")

		if (!userId) {
			await interaction.reply({ content: `You have not associated your discord account to your BrokenGM account`, ephemeral: true });
			return
		}

		const campaignId = uuidv4()
		userAttributes?.campaigns?.push(campaignId)

		const addUserInput = {
			TableName: 'users',
			Item: {
				PK: 'user',
				SK: userId,
				id: userId,
				type: 'user',
				attributes: JSON.stringify(userAttributes),
			},
		}
		const addDiscordUserInput = {
			TableName: 'users',
			Item: {
				PK: 'user',
				SK: `discord#${interaction.user.id}`,
				id: userId,
				type: 'user',
				attributes: JSON.stringify(userAttributes),
			},
		}

		const addCampaignInput = {
			TableName: 'campaigns',
			Item: {
				PK: 'campaign',
				SK: campaignId,
				id: campaignId,
				type: 'campaign',
				attributes: JSON.stringify({
					owner: userId,
					gms: [userId],
					admins: [userId],
					players: [],
					discordServerId: interaction.guild.id,
					transcriptIds: [],
					id: campaignId,
					displayName: campaignName
				}),
			},
		}
		const addCampaignCommand = new PutCommand(addCampaignInput)
		const addDiscordUserCommand = new PutCommand(addDiscordUserInput)
		const addUserCommand = new PutCommand(addUserInput)

		await client.send(addCampaignCommand)
		await client.send(addDiscordUserCommand)
		await client.send(addUserCommand)

		await interaction.reply({ content: `Created ${campaignName} campaign!`, ephemeral: true });
	},
};