import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('create-campaign')
		.setDescription('Creates A campaign and associates it to this discord'),
	async execute(interaction) {
		await interaction.reply({ content: 'You tested the bot... look at you', ephemeral: true });
	},
};