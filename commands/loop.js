const config = require("../config.json");

module.exports.run = (client, msg, args) => {
	const voiceChannel = msg.member.voice.channel;

	if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    if (global.voiceChannels[voiceChannel.id] == null) {
		msg.reply("I don't appear to be in a voice channel!");
	} else {
		const voiceChannelObject = global.voiceChannels[voiceChannel.id];
		voiceChannelObject.loopCurrentSong = !voiceChannelObject.loopCurrentSong;
		msg.channel.send(`${voiceChannelObject.loopCurrentSong ? "Now" : "No longer "} looping current track`);
	}
}

module.exports.info = {
    name: "Loop",
    description: "Loops the currently playing song",
    usage: `${config.prefix}loop`
}