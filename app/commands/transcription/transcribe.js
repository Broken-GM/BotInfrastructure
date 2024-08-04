import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } from 'discord.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid';

export default {
	data: new SlashCommandBuilder()
		.setName('transcribe')
		.setDescription('Transcribe a session'),
	async execute(interaction) {
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
		const campaignIds = JSON.parse(getUserResponse?.Item?.attributes ? getUserResponse?.Item?.attributes : "{}")?.campaigns

		if (!userId) {
			await interaction.reply({ content: `You have not associated your discord account to your BrokenGM account` });
			return
		}

		const campaigns = []

		if (campaignIds.length === 0) {
			await interaction.reply({ content: `You do not have any campaigns` });
			return
		}

		for (let i = 0; i < campaignIds.length; i += 1) {
			const getCampaignCommand = new GetCommand({
				TableName: 'campaigns',
				Key: {
					PK: 'campaign',
					SK: `${campaignIds[i]}`
				},
			})
			const getCampaignResponse = await client.send(getCampaignCommand)
			const campaignAttribute = JSON.parse(getCampaignResponse?.Item?.attributes ? getCampaignResponse?.Item?.attributes : "{}")
			
			campaigns.push({
				label: campaignAttribute?.displayName,
				description: `The Campaign called ${campaignAttribute?.displayName}`,
				value: JSON.stringify({ name: campaignAttribute?.displayName, id: campaignAttribute?.id }),
			})
		}

		const select = new StringSelectMenuBuilder()
			.setCustomId('campaigns')
			.setPlaceholder('Select a campaign')
			.addOptions(campaigns);

		const row = new ActionRowBuilder()
			.addComponents(select);

		const response = await interaction.reply({
			content: 'Choose what campaign to transcribe for',
			components: [row]
		});

		const collectorFilter = i => i.user.id === interaction.user.id;
		let campaignSelected
		let campaignName
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			const campaignObject = JSON.parse(confirmation?.values?.[0])
			campaignSelected = campaignObject?.id
			campaignName = campaignObject?.name
			await confirmation.update({ content: `Selected ${campaignObject?.name}`, components: [] });
		} catch (e) {
			console.log(e)
			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
			return
		}

		const getSelectedCampaignCommand = new GetCommand({
			TableName: 'transcripts',
			Key: {
				PK: 'campaign',
			  	SK: campaignSelected
			},
		})
		const getSelectedCampaignResponse = await client.send(getSelectedCampaignCommand)
		const selectedCampaignAttributes = JSON.parse(getSelectedCampaignResponse?.Item?.attributes ? getSelectedCampaignResponse?.Item?.attributes : `{"id":"${campaignSelected}"}`)

		const sessionId = uuidv4()
		const sessionCount = (selectedCampaignAttributes?.sessionCount ? selectedCampaignAttributes?.sessionCount : 0) + 1
		const sessions = selectedCampaignAttributes?.sessions?.length ? [...selectedCampaignAttributes?.sessions, sessionId] : [sessionId]

		const addCampaignSessionInput = {
			TableName: 'transcripts',
			Item: {
				PK: `campaign#${campaignSelected}`,
				SK: `session#${sessionId}`,
				id: sessionId,
				type: 'session',
				attributes: JSON.stringify({
					id: sessionId,
					sessionNumber: sessionCount,
					start: Date.now()
				}),
			},
		}
		const addSessionInput = {
			TableName: 'transcripts',
			Item: {
				PK: 'session',
				SK: sessionId,
				id: sessionId,
				type: 'session',
				attributes: JSON.stringify({
					id: sessionId,
					sessionNumber: sessionCount,
					start: Date.now()
				}),
			},
		}
		const updateCampaignInput = {
			TableName: 'transcripts',
			Item: {
				PK: 'campaign',
				SK: selectedCampaignAttributes?.id,
				id: selectedCampaignAttributes?.id,
				type: 'campaign',
				attributes: JSON.stringify({
					...selectedCampaignAttributes,
					sessions,
					sessionCount: sessionCount
				}),
			},
		}
		const addSessionCommand = new PutCommand(addSessionInput)
		const addCampaignSessionCommand = new PutCommand(addCampaignSessionInput)
		const updateCampaignCommand = new PutCommand(updateCampaignInput)
		await client.send(addSessionCommand)
		await client.send(addCampaignSessionCommand)
		await client.send(updateCampaignCommand)

		await interaction.editReply({ content: `Transcribing session ${sessionCount} for ${campaignName}`, components: [] })
	},
};