
module.exports = {
	name: 'help',
    description: 'List all of my commands or info about a specific command.',
    shortdescription: 'Lists Commands',
	aliases: ['commands','h'],
	usage: '[command name]',
    admin: false,
    guildOnly: false,
	cooldown: 10,
    execute(client, message, args, playerData, data){
        let admin = false;
        const CommandData = [];
        const { commands } = message.client;
        if (message.channel.type != 'dm') {
            if (message.member.roles.cache.has(data[message.guild].adminrole)) {
                admin = true;
            }
        }

        if (!args.length) {
            CommandData.push('Here\'s a list of all my commands:');
            CommandData.push(commands.map(command => {
                if(!command.admin){
                    return (`\t${command.name}  - ${command.shortdescription}\n`);
                } else if (command.admin && admin) {
                    return (`\tAdmin: ${command.name}  - ${command.shortdescription}\n`);
                }
            }).join(''));
            CommandData.push(`You can send \`${data[message.guild].prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(CommandData, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        CommandData.push(`**Name:** ${command.name}`);

        if (command.aliases) CommandData.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) CommandData.push(`**Description:** ${command.description}`);
        if (command.usage) CommandData.push(`**Usage:** ${data[message.guild].prefix}${command.name} ${command.usage}`);
        if (command.admin) CommandData.push(`**Admin:** This is an admin only command`);


        CommandData.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(CommandData, { split: true });
    }
  };