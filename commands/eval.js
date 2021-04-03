const Discord = require("discord.js"),
      config = require("../config.json");

module.exports.run = (client, msg, args) => {
    if (!config.owner_ids.includes(msg.author.id)) return msg.reply("You do not have permission to execute this command!");

    try {
        var code = args.join(" ")

        if (!code) return msg.channel.send(`No Javascript provided!`);

        var evaled = eval(code)

		const tokenError = new Discord.MessageEmbed()
        .setTitle("Eval Error :x:")
        .addField("**Input :arrow_right:**", `\`\`\`xl\n${code}\n\`\`\``)
        .addField("**Error :x:**", `\`\`\`xl\nCannot complete eval due to token being included\n\`\`\``)

        evaled = require("util").inspect(evaled);

        if (code.includes("token") || evaled.includes(config.token)) return msg.channel.send(tokenError);

        const successEmbed = new Discord.MessageEmbed()
        .setTitle("Eval Success :white_check_mark: ")
        .addField("**Input :arrow_right:**", `\`\`\`xl\n${code}\n\`\`\``)
        .addField("**Output :arrow_left:**", `\`\`\`xl\n${evaled}\n\`\`\``)

        msg.channel.send(successEmbed);
    
    } catch (err) {
        const errorEmbed = new Discord.MessageEmbed()
        .setTitle("Eval Error :x:")
        .addField("**Input :arrow_right:**", `\`\`\`xl\n${code}\n\`\`\``)
        .addField("**Error :x:**", `\`\`\`xl\n${evaled}\n\`\`\``)
        msg.channel.send(errorEmbed);
    }
}

module.exports.info = {
    name: "Eval",
    description: "Owner specific command. Runs javascript code given in the message.",
    usage: `${config.prefix}eval <javascript>`
}