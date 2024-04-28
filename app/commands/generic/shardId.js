import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('shard-id')
		.setDescription('Sends the id of the shard'),
	async execute(interaction) {
		await interaction.reply({ content: `This shard has the id ${interaction.guild.shard.id}`, ephemeral: true });
	},
};