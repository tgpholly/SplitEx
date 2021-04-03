const pirateSpeak = require("pirate-speak"),
      config = require("../config.json");

module.exports.run = (client, msg, args = []) => {
    if (args.length == 0) {
        msg.reply("You need to give me text!");
    } else {
        let reconstructedString = "";
        for (let i = 0; i < args.length; i++)
            reconstructedString += `${i == 0 ? args[i] : ` ${args[i]}`}`;
        
        msg.channel.send(pirateSpeak.translate(reconstructedString));
    }
}

module.exports.info = {
    name: "Pirate",
    description: "Translates your input to pirate speak.",
    usage: `${config.prefix}pirate <text>`
}
