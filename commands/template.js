const config = require("../config.json");

module.exports.run = (client, msg, args) => {
    msg.channel.send("This is a basic template command");
}

module.exports.info = {
    name: "Template Command",
    description: "A generic template command with a generic response.",
    usage: `${config.prefix}template`
}