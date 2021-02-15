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
        let badresult = updateleaderboard.updateleaderboard();      

        if (badresult) 
          return message.channel.send(badresult);
        else
          return message.channel.send("Leaderboard has been updated!");
    }
};