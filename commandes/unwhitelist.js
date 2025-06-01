const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "unwl",
    description: "Supprime un utilisateur de la whitelist.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser("user");

        if (!user) {
            return interaction.reply({
                content: "`❌`・Veuillez mentionner un utilisateur à retirer de la whitelist.",
                ephemeral: true
            });
        }

        let db;
        try {
            db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        } catch (err) {
            console.error("Erreur de lecture DB:", err);
            return interaction.reply({ content: "❌ Erreur de lecture de la base de données.", ephemeral: true });
        }

        db.wl = db.wl || [];

        if (!db.wl.includes(user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`\`❌\`・${user} n'est pas dans la whitelist.`)
                        .setColor(0xff0000)
                ],
                ephemeral: true
            });
        }

        db.wl = db.wl.filter(id => id !== user.id);

        try {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), "utf8");
        } catch (err) {
            console.error("Erreur d'écriture DB:", err);
            return interaction.reply({ content: "❌ Erreur de sauvegarde de la base de données.", ephemeral: true });
        }

        client.perms = client.perms || {};
        client.perms.wl = db.wl;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`\`✅\`・${user} a été retiré de la whitelist.`)
                    .setColor(0x00ff00)
            ],
            ephemeral: true
        });
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName("user")
                    .setDescription("Utilisateur à retirer de la whitelist")
                    .setRequired(true)
            );
    }
};
