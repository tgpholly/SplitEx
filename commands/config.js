const Discord = require("discord.js"),
      config = require("../config.json");

module.exports.run = async (client, msg, args = []) => {
    if (args.length == 0) {
		sendHelpEmbed(msg);
	}

	else {
        switch (args[0]) {
            case "prefix":
                // Validate input
                if (args.length < 2) return msg.channel.send("You need to provide a new prefix to change to!");
                if (args[1].length > 3) return msg.channel.send("The new prefix you provided is too long! Try one that is 3 or less characters.");

                await global.database.run(`UPDATE servers_info SET prefix = '${args[1]}' WHERE id = ${msg.dbInfo.id}`);

                msg.channel.send(`Changed server prefix to \`${args[1]}\``);
            break;

            default: 
                msg.channel.send("Unrecognised config option. Showing help")
                sendHelpEmbed(msg);
            break;
        }
	}
}

function sendHelpEmbed(msg) {
    let embed = new Discord.MessageEmbed()
        .setTitle("SplitEx Server Config")
        .setTimestamp()
        .setDescription("Change settings for SplitEx on your server")
        .setFooter("SplitEx");

    embed["fields"].push({
        name: "prefix",
        value: `Usage: ${msg.dbInfo.prefix}config prefix <new prefix>`,
        inline: true
    });

    msg.channel.send(embed);
}

module.exports.info = {
    name: "Config",
    description: "Allows you to change options for the bot pertaining to your server.",
    usage: `${config.prefix}config`
}