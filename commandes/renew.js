const { SlashCommandBuilder, ChannelType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: "renew",
  description: "Supprime et recrée le salon où la commande est exécutée.",
  aliases: [],
  permissions: [],
  guildOwnerOnly: false,
  botOwnerOnly: false,
  botOwner: false,
  wlOnly: true,
  async executeSlash(client, interaction) {
    const ch = interaction.channel;
    if (!config.categorie.includes(ch.parentId))
      return interaction.reply({ content: "`❌`・Ce salon n'est pas dans une catégorie autorisée.", ephemeral: true });

    try {
      const perms = ch.permissionOverwrites.cache.map(o => ({
        id: o.id,
        type: o.type,
        allow: o.allow.bitfield,
        deny: o.deny.bitfield,
      }));

      await ch.delete();

      const newCh = await interaction.guild.channels.create({
        name: ch.name,
        type: ch.type,
        topic: ch.topic,
        nsfw: ch.nsfw,
        rateLimitPerUser: ch.rateLimitPerUser,
        permissionOverwrites: perms,
        parent: ch.parentId,
        reason: 'Salon recréé par /renew',
      });

      await newCh.setPosition(ch.position);
      await newCh.send(`Ce salon a été recréé avec succès par ${interaction.user}.`);
    } catch {
      interaction.reply({ content: "`❌`・Erreur lors de la recréation du salon.", ephemeral: true });
    }
  },

  data: new SlashCommandBuilder().setName("renew").setDescription("Supprime et recrée le salon où la commande est exécutée.")
};
