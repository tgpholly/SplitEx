const config = require("../config.json");

module.exports.run = (client, msg) => {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    // Make sure we are even connected to this voice channel
    if (global.voiceChannels[voiceChannel.id] != null) {
        // Cache voice channel object
        const voiceObject = global.voiceChannels[voiceChannel.id];
        // Clear the queue
        voiceObject.queue = [];
        // Make sure it can't play the next track in the queue if there is any
        voiceObject.shouldPlayQueuedTracks = false;
        // Stop the currently playing track
        if (voiceObject.dispatcher != null) voiceObject.dispatcher.end();
        // Leave the voice channel
        voiceObject.voiceConnection.disconnect();
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