const QueueTrack = require("./QueueTrack.js");

module.exports = class {
    constructor(channelID = 0, voiceChannelConnection = null, msg) {
        this.channelID = channelID;

        this.timeoutTime = NaN;

        this.boundTextChannel = msg.channel;

        //this.boundTextChannel.send("Messages bound to this channel.");

        this.voiceConnection = voiceChannelConnection;

        this.dispatcher = null;

        this.executeAfterPlayActions = true;

        this.queue = [];
    }

    addTrackToQueue(queueObject) {
        this.queue.push(queueObject);
    }

    getQueriesFromURL(url = "") {
        url = url.split("?")[1].split("&");
        let queries = {};
        for (let i = 0; i < url.length; i++) {
            const query = url[i].split("=");
            queries[query[0]] = query[1];
        }
        return queries;
    }

    removeTopLevelObjectFromQueue() {
        this.queue.splice(0, 1);
    }
}