const updateleaderboard = require("../updateleaderboard");

  module.exports = {
    name: 'updateleaderboard',
    description: 'Updates the leaderboard. This is automatically done after running !results',
    shortdescription: 'Updates the leaderboard',
    usage: '',
    aliases: [],
    guildOnly: true,
    cooldown: 30,
    admin: true,
    execute(client, message){
        updateleaderboard.updateleaderboard(function (err, result) {
          // *always* check for err
          if (err){
            console.log ('error', err.message, err.stack);
            message.reply(err.message);
          } else {
            console.log ('result', result);
            message.reply('Leaderboard updated');
          }
        });
      }
};