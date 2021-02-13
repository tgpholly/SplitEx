const Discord = require("discord.js"),
      config = require("../config.json");

module.exports.run = (client, msg, args) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    if (global.voiceChannels[voiceChannel.id] != null) {
        if (global.voiceChannels[voiceChannel.id].queue.length > 0) {
            let embed = new Discord.MessageEmbed()
            .setTitle("Queue")
            .setTimestamp()
            .setFooter("SplitEx");
            embed["fields"] = [];
            for (let i = 0; i < 20; i++) {
                if (i > (global.voiceChannels[voiceChannel.id].queue.length - 1)) break;
                embed["fields"].push({
                    name: `#${i + 1}: ${global.voiceChannels[voiceChannel.id].queue[i].trackInfo.title}`,
                    value: " Duration: " + global.voiceChannels[voiceChannel.id].queue[i].trackInfo.length
                });
            }
            msg.channel.send(embed);
        } else {
            msg.channel.send("There is nothing in the queue")
        }
    } else {
        msg.channel.send("There is nothing in the queue")
    }
}

module.exports.info = {
    name: "Queue",
    description: "Shows 20 queued songs from your queue.",
    usage: `${config.prefix}queue`
}