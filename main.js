//bot link https://discordapp.com/oauth2/authorize?client_id=732691573115977748&scope=bot&permissions=2146958847
//devbot link https://discordapp.com/oauth2/authorize?client_id=772467500754927617&scope=bot&permissions=2146958847
const discord = require("discord.js"); //discord commands
const fs = require("fs"); //file interaction
const createplayer = require("./initialplayerdata");
const client = new discord.Client();
const cooldowns = new discord.Collection();

require("dotenv-flow").config();

const config = {
  token: process.env.token,
  owner: process.env.owner,
  prefix: process.env.prefix,
  discordtoken: process.env.discordtoken,
};

const prefix = config.prefix;

client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Clash Royale Bot is online!");
  console.log(`Logged in as ${client.user.tag}!`);
});

let playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
let data = JSON.parse(fs.readFileSync("Storage/data.json", "utf8"));

client.on("message", async (message) => {

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
  data = JSON.parse(fs.readFileSync("Storage/data.json", "utf8"));

  if (!playerData[message.author.id]) {
    createplayer.execute(client, message, args, playerData);
    playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
  }

  const command = client.commands.get(commandName)
      || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.args && !args.length) {
    let reply = (`You didn't provide any arguments, ${message.author}!`);

    if (command.usage) {
      reply += `\nTheproper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
    }
  
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }
  //admin Id from CRS - 725409051416199240
  if (command.admin && !message.member.roles.cache.has('545120563450871819')) {
    return message.reply('This command can only be run by an admin');
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new discord.Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args, playerData, data);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.on("ready", () => {
  console.log("Bot loaded");
});

client.login(config.discordtoken);