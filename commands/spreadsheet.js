module.exports = {
    name: 'spreadsheet',
    description: 'Sends a link to the spreadsheet',
    shortdescription: 'Spreadsheet link',
    aliases: ['link', 'spreadsheetlink'],
    guildOnly: true,
    cooldown: 30,
    admin: false,
    execute(client, message){
        message.reply('https://docs.google.com/spreadsheets/d/1X_UgYtLPzK5rBr2YbPpDDWNEakEaB1YHk3e6aA1fl8I/edit?usp=drivesdk');
    }
    };