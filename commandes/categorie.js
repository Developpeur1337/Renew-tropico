const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: "categorie",
    description: "Gérer les catégories autorisées pour la commande /renew.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        const subcommand = interaction.options.getSubcommand();
        const categorie = interaction.options.getString('id');

        switch (subcommand) {
            case "add": {
                const kategory = interaction.guild.channels.cache.get(categorie);
                if (!kategory || kategory.type !== 4) {
                    return interaction.reply({ content: "`❌`・Catégorie invalide ou introuvable.", ephemeral: true });
                }

                if (config.categorie.includes(categorie)) {
                    return interaction.reply({ content: "`❌`・Cette catégorie est déjà whitelistée.", ephemeral: true });
                }

                config.categorie.push(categorie);
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

            const embed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setAuthor({ name: "✅ Catégorie ajoutée à la whitelist", iconURL: interaction.user.displayAvatarURL() })
                .setDescription([
                    `> 🆔 **ID :** \`${categorie}\``,
                    `> 📁 **Nom :** \`${kategory.name}\``,
                    `> 👤 **Ajoutée par :** <@${interaction.user.id}>`
                ].join("\n"))
                .setTimestamp();


                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            case "remove": {
                if (!config.categorie.includes(categorie)) {
                    return interaction.reply({ content: "`❌`・Cette catégorie n'est pas whitelistée.", ephemeral: true });
                }

                const kategory = interaction.guild.channels.cache.get(categorie);

                config.categorie = config.categorie.filter(id => id !== categorie);
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

                const name = kategory?.name ?? "Catégorie inconnue";

                const embed = new EmbedBuilder()
                    .setColor("#E74C3C")
                    .setAuthor({ name: "❌ Catégorie retirée de la whitelist", iconURL: interaction.user.displayAvatarURL() })
                    .setDescription([
                        `> 🆔 **ID :** \`${categorie}\``,
                        `> 📁 **Nom :** \`${name}\``,
                        `> 👤 **Retirée par :** <@${interaction.user.id}>`
                    ].join("\n"))
                    .setTimestamp();


                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            case "list": {
                if (config.categorie.length === 0) {
                    return interaction.reply({ content: "`ℹ️`・Aucune catégorie whitelistée.", ephemeral: true });
                }

                    config.categorie.map(id => {
                    const kategory = interaction.guild.channels.cache.get(id);
                    const name = kategory?.name ?? "Catégorie inconnue";
                    return `• **${name}** | \`${id}\``;
                });

                const embed = new EmbedBuilder()
                    .setColor("#3498DB")
                    .setAuthor({ name: "📂 Liste des catégories autorisées", iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(
                        config.categorie.length > 0
                            ? config.categorie
                                .map((id, index) => {
                                    const kategory = interaction.guild.channels.cache.get(id);
                                    return kategory
                                        ? `\`${index + 1}\` - 📁 **${kategory.name}** | \`${kategory.id}\``
                                        : `\`${index + 1}.\` - 📁 *(Catégorie introuvable)* | \`${id}\``;
                                })
                                .join("\n")
                            : "`Aucune catégorie whitelistée pour le moment.`"
                    )
                    .setFooter({ text: `Total : ${config.categorie.length} catégorie(s)` })
                    .setTimestamp();


                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            default:
                return interaction.reply({ content: "`❌`・Sous-commande inconnue.", ephemeral: true });
        }
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(sub => sub
                .setName('add')
                .setDescription("Ajouter une catégorie à la whitelist.")
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID de la catégorie à ajouter')
                        .setRequired(true)))
            .addSubcommand(sub => sub
                .setName('remove')
                .setDescription("Retirer une catégorie de la whitelist.")
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID de la catégorie à retirer')
                        .setRequired(true)))
            .addSubcommand(sub => sub
                .setName('list')
                .setDescription("Lister les catégories whitelistées."));
    }
};
