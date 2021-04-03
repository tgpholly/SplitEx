const config = require("../config.json");

module.exports.run = (client, msg) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    if (global.voiceChannels[voiceChannel.id] != null) {
        global.voiceChannels[voiceChannel.id].queue = [];
        msg.reply("Cleared queue.");
    } else {
        msg.reply("I am not connected to a voice channel");
    }
}

module.exports.info = {
    name: "Clear",
    description: "Removes all queued songs.",
    usage: `${config.prefix}clear`
}