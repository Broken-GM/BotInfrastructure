import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('get-shard-info')
		.setDescription('Sends info on the current connected cluster'),
	async execute(interaction) {
		await interaction.reply({ content: `Shard Count: ${process.env.NUMBER_OF_CLUSTERS}\nCluster ID: ${process.env.CLUSTER_INDEX}`, ephemeral: true });
	},
};