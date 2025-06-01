const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "wl",
    description: "Ajoute un utilisateur à la whitelist ou affiche les utilisateurs whitelistés.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser("user");

        let db;
        try {
            db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        } catch (err) {
            console.error("Erreur de lecture DB:", err);
            return interaction.reply({ content: "❌ Erreur de lecture de la base de données.", ephemeral: true });
        }

        db.wl = db.wl || [];

        if (!user) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: "📜・Liste des utilisateurs whitelistés", iconURL: interaction.user.displayAvatarURL() })
                .setColor("#27AE60")
                .setDescription(
                    db.wl.length > 0
                        ? db.wl.map((id, i) => `\`${i + 1}\` - <@${id}> | \`${id}\``).join('\n')
                        : "`Aucun utilisateur whitelisté.`"
                )
                .setFooter({ text: `Total : ${db.wl.length} utilisateur(s)` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (db.wl.includes(user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`\`❌\`・${user} est déjà dans la whitelist.`)
                        .setColor(0xff0000)
                ],
                ephemeral: true
            });
        }

        db.wl.push(user.id);

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
                    .setDescription(`\`✅\`・${user} a été ajouté à la whitelist.`)
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
                    .setDescription("Utilisateur à ajouter à la whitelist")
                    .setRequired(false)
            );
    }
};
