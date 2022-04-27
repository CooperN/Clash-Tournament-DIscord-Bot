//bot link https://discordapp.com/oauth2/authorize?client_id=732691573115977748&scope=bot&permissions=2146958847
//devbot link https://discordapp.com/oauth2/authorize?client_id=772467500754927617&scope=bot&permissions=2146958847
const discord = require("discord.js"); //discord commands
const fs = require("fs"); //file interaction
const client = new discord.Client();
const cooldowns = new discord.Collection();
const {Player, playerlistupdate} = require("./helpers/player");
const {Guild, guildDataUpdate} = require("./helpers/guild");
const {saveClient} = require("./helpers/functions");

require("dotenv-flow").config();

client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

saveClient(client);

client.once("ready", () => {
  console.log("Clash Royale Bot is online!");
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {  

  if (message.author.bot) return;
  let currentGuild = new Guild(message);

  //filter if they don't have the prefix
  if (process.env.testing){
    if (!message.content.startsWith(process.env.testprefix)) return;
  }
  else if (!message.content.startsWith(currentGuild.getGuildPrefix())) return;



  let args = [];
  //split the message into the command and the arguments
  if (process.env.testing){
    args = message.content.slice(process.env.testprefix.length).split(/ +/);
  }
  else {
    args = message.content.slice(currentGuild.getGuildPrefix().length).trim().split(/ +/);
  }

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
      || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.args && !args.length) {
    let reply = (`You didn't provide any arguments, ${message.author}!`);

    if (command.usage) {
      reply += `\nTheproper usage would be: \`${currentGuild.getGuildPrefix()}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
    }
  
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.admin && !message.member.roles.cache.has(currentGuild.getAdminRole())) {
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
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.on("ready", () => {
  console.log("Bot loaded");
});

client.login(process.env.discordtoken);