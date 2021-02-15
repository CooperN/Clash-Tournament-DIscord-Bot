const fs = require("fs"); //file interaction

module.exports = {
    name: 'setweek',
    args: true,
    usage: '<weeknumber>',
    description: 'admin command - sets the current week of the tournament',
    shortdescription: 'Sets week of Tourney',
    guildOnly: true,
    admin: true,
    execute(client, message, args, playerData, data){
            var currentweek = parseInt(args.shift());
            if(Number.isInteger(1)){
                data.tournamentweek = currentweek;

                fs.writeFileSync(
                    "Storage/data.json",
                    JSON.stringify(data),
                    (err) => {
                      //This writes the changes to the JSON
                      if (err) console.error(err);
                    }
                  );
    
                message.channel.send(`Current week has been set to: ${currentweek}`);

            } else {
                message.channel.send('Please enter a week number after the command');
            }
    }
  };