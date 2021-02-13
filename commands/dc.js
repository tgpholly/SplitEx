const config = require("../config.json");

module.exports.run = (client, msg, args) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    // Make sure we are even connected to this voice channel
    if (global.voiceChannels[voiceChannel.id] != null) {
        // Clear the queue
        global.voiceChannels[voiceChannel.id].queue = [];
        // Make sure it can't play the next track in the queue if there is any
        global.voiceChannels[voiceChannel.id].shouldPlayQueuedTracks = false;
        // Stop the currently playing track
        global.voiceChannels[voiceChannel.id].dispatcher.end();
        // Leave the voice channel
        global.voiceChannels[voiceChannel.id].voiceConnection.disconnect();
        // Remove the voiceChannel object from the array
        delete global.voiceChannels[voiceChannel.id];
        
        msg.channel.send("Disconnected.");
    } else {
        msg.reply("I am not connected to a voice channel");
    }
}

module.exports.info = {
    name: "Disconnect",
    description: "Disconnects the bot from the voice channel you are currently in.",
    usage: `${config.prefix}dc`
}