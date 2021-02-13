const Discord = require("discord.js"),
      config = require("../config.json"),
      VoiceChannel = require("../VoiceChannelQueueManager.js"),
      ytdl = require('ytdl-core-discord'),
      QueueTrack = require("../QueueTrack.js"),
      youtubeSearch = require("youtube-sr");

module.exports.run = async (client, msg, args) => {
    const voiceChannel = msg.member.voice.channel;

    if (args.length == 0) return msg.reply("You need to provide a URL to be played");

    if (!voiceChannel) return msg.reply("Looks like you're not in a voice channel");

    let reconstructedString = null;
    if (!args[0].includes("http://") || !args[0].includes("https://")) {
        reconstructedString = "";
        for (let i = 0; i < args.length; i++) {
            if (i == 0) {
                reconstructedString += args[i];
            } else {
                reconstructedString += ` ${args[i]}`;
            }
        }
    }

    const searchMessage = msg.channel.send(`Searching for: "**${reconstructedString == null ? args[0] : reconstructedString.split("*").join("\\*")}**"`);

    let searchData = null;
    if (!args[0].includes("http://") || !args[0].includes("https://")) {
        
        searchData = await youtubeSearch.search(reconstructedString, { limit: 1 });
        
    } else {
        searchData = await youtubeSearch.search(args[0], { limit: 1 });
    }

    searchData = searchData[0];

    // Check if we are connected or not
    if (global.voiceChannels[voiceChannel.id] != null) {
        // If the queue is not empty
        if (global.voiceChannels[voiceChannel.id].queue.length > 0) {
            global.voiceChannels[voiceChannel.id].addTrackToQueue(new QueueTrack(`https://www.youtube.com/watch?v=${searchData.id}`, { title: searchData.title, uploader: searchData.channel.name, thumbnailURL: searchData.thumbnail.url, length: searchData.durationFormatted }));
            msg.reply("Added to queue");
        } else {
            // If we are not currently playing so start playing immidiately
            if (global.voiceChannels[voiceChannel.id].dispatcher != null) {
                global.voiceChannels[voiceChannel.id].addTrackToQueue(new QueueTrack(`https://www.youtube.com/watch?v=${searchData.id}`, { title: searchData.title, uploader: searchData.channel.name, thumbnailURL: searchData.thumbnail.url, length: searchData.durationFormatted }));
                msg.reply("Added to queue");
            }
            else {
                play(global.voiceChannels[voiceChannel.id].voiceConnection, voiceChannel.id, new QueueTrack(`https://www.youtube.com/watch?v=${searchData.id}`, { title: searchData.title, uploader: searchData.channel.name, thumbnailURL: searchData.thumbnail.url, length: searchData.durationFormatted }));
            }
        }
    } else {
        // Create voice channel connection object
        global.voiceChannels[voiceChannel.id] = new VoiceChannel(voiceChannel.id, null, msg);
        // Connect to the voice channel
        const voiceConnection = await voiceChannel.join();

        global.voiceChannels[voiceChannel.id].voiceConnection = voiceConnection;

        // Play song
        play(voiceConnection, voiceChannel.id, new QueueTrack(`https://www.youtube.com/watch?v=${searchData.id}`, { title: searchData.title, uploader: searchData.channel.name, thumbnailURL: searchData.thumbnail.url, length: searchData.durationFormatted }), searchMessage);
    }
}

async function play(voiceConnection, channelID, videoInfo = null, messageToEdit = null) {
    if (global.voiceChannels[channelID].queue.length > 0) global.voiceChannels[channelID].removeTopLevelObjectFromQueue();
    global.voiceChannels[channelID].dispatcher = voiceConnection.play(await ytdl(videoInfo.trackURL), { type: "opus" });

    global.voiceChannels[channelID].dispatcher.on("start", () => {
        global.voiceChannels[channelID].boundTextChannel.send("Now playing: **\"" + videoInfo.trackInfo.title.split("*").join("\\*") + "\"**");
    });

    global.voiceChannels[channelID].dispatcher.on("finish", () => {
        if (global.voiceChannels[channelID] != null) {
            global.voiceChannels[channelID].dispatcher = null;
            if (global.voiceChannels[channelID].queue.length > 0) {
                if (global.voiceChannels[channelID].executeAfterPlayActions)
                    play(voiceConnection, channelID, global.voiceChannels[channelID].queue[0]);
            }
        }
    });
}

module.exports.info = {
    name: "Play",
    description: "Plays or queues a specified song.",
    usage: `${config.prefix}play <song name or url>`
}