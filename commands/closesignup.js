const fs = require("fs"); //file interaction

module.exports = {
    name: 'closesignup',
    description: 'stop accepting new players to join',
    shortdescription: 'Close Signups for Tourney',
    guildOnly: true,
    admin: true,
    execute(client, message, args, playerData, data){
      guild = message.guild
      data.guild.signupopen = false;
      fs.writeFileSync(
          "Storage/data.json",
          JSON.stringify(data),
          (err) => {
            //This writes the changes to the JSON
            if (err) console.error(err);
          }
        );
      message.channel.send('Sign ups for the tournament are now closed!');
    }
  };