const config = require("../config.json");

module.exports.run = (client, msg, args) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    const voiceObject = global.voiceChannels[voiceChannel.id];

    voiceObject.skippedPreviousSong = true;
    if (voiceObject.dispatcher != null) voiceObject.dispatcher.end();

    msg.channel.send("Skipped");
}

module.exports.info = {
    name: "Skip",
    description: "Skips the currently playing song.",
    usage: `${config.prefix}skip`
}