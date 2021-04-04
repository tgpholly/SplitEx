const Discord = require("discord.js"),
      config = require("../config.json");

module.exports.run = (client, msg, args = []) => {
    if (args.length == 0) {
        let embed = new Discord.MessageEmbed()
        .setTitle("Help")
        .setTimestamp()
        .setDescription("All Commands")
        .setFooter("SplitEx");

        for (let i = 0; i < Math.min(global.commandKeys.length, 10); i++) {
            if (i > (global.commands[global.commandKeys[i]].length - 1)) continue;
            const command = global.commands[global.commandKeys[i]];

            embed["fields"].push({
                name: `${msg.dbInfo.prefix}${global.commandKeys[i]}`,
                value: command.info.description,
                inline: true
            });
        }

        msg.channel.send(embed);
    } else {
        if (global.commandKeys.includes(args[0])) {
            const command = global.commands[args[0]];
            let embed = new Discord.MessageEmbed()
            .setTitle("Help: " + command.info.name)
            .setTimestamp()
            .setFooter("SplitEx");

            embed["fields"].push({
                name: `Description: ${command.info.description}`,
                value: `Usage: ${command.info.usage}`,
            });

            msg.channel.send(embed);
        } else {
            msg.reply("That command does not exist!");
        }
    }
}

module.exports.info = {
    name: "Help",
    description: "Shows this message.",
    usage: `${config.prefix}help <command>`
}