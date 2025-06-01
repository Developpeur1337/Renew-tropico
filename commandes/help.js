const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche la page d'aide du bot",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: false,
    wlOnly: true,
    async executeSlash(client, interaction) {
        const commands = await client.application.commands.fetch();
        const fdp = commands.find(c => c.name === "categorie");

        const data = [
            { name: "categorie add", id: fdp?.id, desc: "Autorise une catégorie pour /renew" },
            { name: "categorie remove", id: fdp?.id, desc: "Retire une catégorie autorisée" },
            { name: "categorie list", id: fdp?.id, desc: "Liste des catégories autorisées" },
            { name: "renew", desc: "Recrée le salon actuel" },
            { name: "wl", desc: "Ajoute un utilisateur à la whitelist ou les liste" },
            { name: "unwl", desc: "Retire un utilisateur de la whitelist" },
            { name: "owner", desc: "Ajoute ou liste les owners" },
            { name: "unowner", desc: "Retire un owner" },
            { name: "help", desc: "Affiche cette aide" }
        ];

        const desc = data.map(cmd => {
            const [base, sub] = cmd.name.split(" ");
            const mainCmd = commands.find(c => c.name === base);
            if (sub && cmd.id) return `* </${cmd.name}:${cmd.id}> \`-\` ${cmd.desc}`;
            if (mainCmd) return `* ${chatInputApplicationCommandMention(base, mainCmd.id)} \`-\` ${cmd.desc}`;
            return `* \`/${cmd.name}\` \`-\` ${cmd.desc} *(non trouvée)*`;
        }).join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setDescription([
                "**__Page d'aide__**",
                "",
                "<a:Fleche:1289675112559280140> **Commandes slash :**",
                desc
            ].join("\n"))
            .setImage("https://cdn.discordapp.com/attachments/1051238708734611506/1051238771045187665/barre.jpg");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la page d'aide du bot")
};
