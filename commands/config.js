const config = require("../config.json");

module.exports.run = (client, msg, args = []) => {
    if (args.length == 0) {
		
	}

	else {

	}
}

module.exports.info = {
    name: "Config",
    description: "Allows you to change options for the bot pertaining to your server.",
    usage: `${config.prefix}config`
}