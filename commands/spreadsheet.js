module.exports = {
    name: 'spreadsheet',
    description: 'Sends a link to the spreadsheet',
    shortdescription: 'Spreadsheet link',
    aliases: ['link', 'spreadsheetlink'],
    guildOnly: true,
    cooldown: 30,
    admin: false,
    execute(client, message, args, playerData, data){
        message.reply(data[message.guild].spreadsheetlink);
    }
    };