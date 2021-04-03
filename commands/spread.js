const config = require("../config.json");

module.exports.run = (client, msg, args = []) => {

	if (args.length == 0) return msg.reply("You need to provide text to be spread.");
	
	const message = args.join(" ");

	message.split("```").join("\\```");

	let splitChars = message.split("");
	let messageToSend = "";
	for (let i = 0; i < splitChars.length; i++) 
		messageToSend += `${splitChars[i]}${addSpaces(i + 1)}`;
		
	msg.reply("```"+messageToSend+"```");
}

function addSpaces(numberOfSpaces = 0) {
	let s = "";
	for (let i = 0; i < numberOfSpaces; i++)
		s += " ";

	return s;
}

module.exports.info = {
    name: "Spread",
    description: "Gradually spreads the characters in your message further and further away from each other.",
    usage: `${config.prefix}spread <text>`
}