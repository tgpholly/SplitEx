const Discord = require("discord.js"),
	  client = new Discord.Client(),
	  config = require("./config.json"),
	  fs = require("fs"),
	  chalk = require("chalk"),
	  sqlite = require("sqlite3").verbose();

console.clear();
fs.writeFileSync("errors.log", "");

global.entryPoint = __dirname;

function getTime() {
	const date = new Date();
	let t24 = [date.getHours(), date.getMinutes()];
	let time = "AM";
	if (t24[0] > 11) {
		time = "PM";
		t24[0] -= 12;
		if (t24[0] <= 0) t24[0] = 12;
	}
	return `${t24[0]}:${t24[1] < 10 ? `0${t24[1]}` : t24[1]} ${time}`;
}

global.log = (s) => console.log(`${chalk.green(`[${getTime()}]`)} ${s}`);
global.warn = (s) => console.log(`${chalk.green(`[${getTime()}]`)} ${chalk.yellow(s)}`);
global.error = (e) => fs.appendFileSync("errors.log", `An error occured during execution\nTime: ${new Date()}\nError:\n${e}\n==========================================\n`);

global.commands = {};
global.commandKeys = [];

// Music stuff

global.voiceChannels = {};

// Serialise the database

global.database = new sqlite.Database("SplitEx.sqlite");
 
if (!fs.existsSync(__dirname + "/SplitEx.sqlite")) {
	global.database.serialize(() => {
		global.database.run(`
			CREATE TABLE servers_info (
				"id" INTEGER PRIMARY KEY AUTOINCREMENT,
				"server_id" VARCHAR(24) NOT NULL,
				"prefix" VARCHAR(3) NOT NULL
			)
		`);
	});
} else {
	global.database.serialize(() => {

	});
}

async function databaseFetch(query) {
	return new Promise((resolve, reject) => {
		if (query.includes("LIMIT 1")) {
			global.database.get(query, [], (err, row) => {
				if (err) reject(err);
				else resolve(row);
			});
		} else {
			db.all(query, [], (err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			});
		}
	});
}

// Get all files in the commands directory

fs.readdir("./commands/", (err, files) => {
	if (err) {
		global.error(err);
		console.error("There was a problem loading commands, the error was logged to errors.log");
		process.exit(1);
	}

	global.log("Loading commands...");

	// Make sure there are commands to load
	if (files.length == 0) {
		global.log("There are no commands to load!");
		process.exit(1);
	}

	for (let file of files) {
		try {
			global.commands[file.split(".js")[0]] = require(`./commands/${file}`);
			global.log(`Loaded command ${chalk.magenta(`[${file}]`)}`);
		} catch (e) {
			global.error(e);
			console.warn(`There was an issue loading command [${file}] the error was logged to errors.log`);
		}
	}

	// Generate a list of keys for the commands
	global.commandKeys = Object.keys(global.commands);

	global.log(`Loaded ${global.commandKeys.length} commands`);

	startBot();
});

function startBot() {
	// Connect to discord
	const connectionStartTime = new Date().getTime();
	global.log("Connecting to discord...")
	client.login(config.token);

	client.on("ready", () => global.log(`Connected to discord! Took ${new Date().getTime() - connectionStartTime}ms`));

	client.on("message", async (msg) => {
		// Check if this server is in the database
		let databaseServer = await databaseFetch(`SELECT id, prefix FROM servers_info WHERE server_id = "${msg.guild.id}" LIMIT 1`);
		if (databaseServer == null) {
			// We don't have this server in the database, add it.
			await global.database.run(`INSERT INTO servers_info ("server_id", "prefix") VALUES ("${msg.guild.id}", "${config.prefix}")`);
			databaseServer = await databaseFetch(`SELECT id, prefix FROM servers_info WHERE server_id = "${msg.guild.id}" LIMIT 1`);
		}

		// Inject the database info into the message class
		msg.dbInfo = databaseServer;

		let command = msg.content.split(" ")[0];

		if (!command.startsWith(databaseServer.prefix)) return;

		command = command.replace(databaseServer.prefix, "");

		if (global.commandKeys.includes(command)) {
			try {
				// Get command args
				let args = msg.content.split(" ");
				args.shift();
				
				// Run command
				global.commands[command].run(client, msg, args);
			} catch (e) {
				global.error(e);
				msg.channel.send("There was an error running that command! Please try again later.");
			}
		}
	});
}