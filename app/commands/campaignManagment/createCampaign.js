import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

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
		const client = new SecretsManagerClient({ region: 'us-west-2' });

        const secretResponse = await client.send(
            new GetSecretValueCommand({
                SecretId: process.env.BOT_SECRET_ARN,
            }),
        );
		const parsedResponse = JSON.parse(secretResponse.SecretString)

		const createCampaignResponse = await fetch(`https://api.${process.env.DOMAIN}/campaign/create/`, { 
			method: 'POST', 
			headers: {
				'x-api-key': parsedResponse?.backendApi
			},
			body: JSON.stringify({
				discordId: interaction.user.id,
				campaignName
			})
		})
		const createCampaignObject = createCampaignResponse.json()

		if (createCampaignObject?.body?.message === 'userId/discordId does not exist or is invalid') {
			await interaction.reply({ content: `You have not associated your discord account to your BrokenGM account`, ephemeral: true });
			return
		}

		await interaction.reply({ content: `Created ${campaignName} campaign!`, ephemeral: true });
	},
};