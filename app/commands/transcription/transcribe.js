import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } from 'discord.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

export default {
	data: new SlashCommandBuilder()
		.setName('transcribe')
		.setDescription('Transcribe a session'),
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
		const campaignIds = JSON.parse(getUserResponse?.Item?.attributes ? getUserResponse?.Item?.attributes : "{}")?.campaigns

		if (!userId) {
			await interaction.reply({ content: `You have not associated your discord account to your BrokenGM account`, ephemeral: true });
			return
		}

		const campaigns = []

		for (let i = 0; i < campaignIds.length - 1; i += 1) {
			const getCampaignCommand = new GetCommand({
				TableName: 'campaigns',
				Key: {
					PK: 'campaign',
					SK: `${campaignIds[i]}`
				},
			})
			const getCampaignResponse = await client.send(getCampaignCommand)
			const campaignAttribute = JSON.parse(getCampaignResponse?.Item?.attributes ? getCampaignResponse?.Item?.attributes : "{}")
			
			campaigns.push(new StringSelectMenuOptionBuilder()
				.setLabel(`${campaignAttribute?.displayName}`)
				.setDescription(`The Campaign called ${campaignAttribute?.displayName}`)
				.setValue(campaignAttribute?.id))
		}

		const select = new StringSelectMenuBuilder()
			.setCustomId('campaigns')
			.setPlaceholder('Select a campaign')
			.addOptions(campaigns);

		const row = new ActionRowBuilder()
			.addComponents(select);

		response = await interaction.reply({
			content: 'Choose what campaign to transcribe for',
			components: [row], ephemeral: true
		});

		// const collectorFilter = i => i.user.id === interaction.user.id;
		// try {
		// 	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
		
		// 	await confirmation.update({ content: `${confirmation.customId}`, components: [] });
		// } catch (e) {
		// 	await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
		// }
	},
};