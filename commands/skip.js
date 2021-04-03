const config = require("../config.json");

module.exports.run = (client, msg, args) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    global.voiceChannels[voiceChannel.id].skippedPreviousSong = true;
    global.voiceChannels[voiceChannel.id].dispatcher.end();

    msg.channel.send("Skipped");
}

module.exports.info = {
    name: "Skip",
    description: "Skips the currently playing song.",
    usage: `${config.prefix}skip`
}