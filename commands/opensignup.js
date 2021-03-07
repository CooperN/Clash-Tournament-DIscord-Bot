const fs = require("fs"); //file interaction

module.exports = {
    name: 'opensignup',
    description: 'starts the tournament! Will begin accepting users',
    shortdescription: 'Starts accepting signups',
    guildOnly: true,
    admin: true,
    execute(client, message, args, playerData, data){
      data[message.guild].signupopen = true;

      fs.writeFileSync(
          "Storage/data.json",
          JSON.stringify(data),
          (err) => {
            //This writes the changes to the JSON
            if (err) console.error(err);
          }
        );

      message.channel.send('Sign ups for the tournament are now open! \nJoin by typing !join');
    }
  };