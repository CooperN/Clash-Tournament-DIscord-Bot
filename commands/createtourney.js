const updateleaderboard = require("../updateleaderboard");
const challonge = require('challonge');
const fs = require("fs"); //file interaction

module.exports = {
    name: 'createtourney',
    description: 'Creates a new tournament',
    shortdescription: 'Creates a new tournament',
    usage: '',
    aliases: ['newtourney','createtournament','newtournament','crt'],
    guildOnly: true,
    cooldown: 30,
    admin: true,
    execute(client, message, args, playerData, data){
      let tournyid = 0;
      let badresult = updateleaderboard.updateleaderboard(message.guild);      

      if (badresult) 
        return message.channel.send(badresult);
      else
        message.channel.send("Leaderboard has been updated for the tourney! This list is used to create the Tournament.");

      const challongeclient = challonge.createClient({
        apiKey: process.env.challongetoken
      });

      //add players
      let PlayerStats = JSON.parse(fs.readFileSync("Storage/playerStats.json", "utf8"));


      const PlayerStatsAsArray = Object.keys(PlayerStats[message.guild]).map(function (key) {
        PlayerStats[message.guild][key].name = key;
        return PlayerStats[message.guild][key];
      })
      .sort(function (itemA, itemB) {
        if(itemB.wins == itemA.wins && itemB.matchwins == itemA.matchwins)
        {
          return itemA.towerstaken - itemB.towerstaken;
        }
        else if(itemB.wins == itemA.wins)
        {
          return itemA.matchwins - itemB.matchwins;
        }
        else
        {
          return itemA.wins - itemB.wins;
        }
      });

      // create a new tournament
      challongeclient.tournaments.create({
        tournament: {
          name: message.guild.name + ' CRS Season ' + data[message.guild].seasonnumber,
          url: message.guild.name.replace(/\s/g, '_') + '_CRS_Season_'+data[message.guild].seasonnumber,
          tournamentType: 'single elimination',
        },
        callback: (err, body) => {
          if (err) {
            console.log(err, body);
            return message.reply("There was an issue creating the tournament. Please contact @chocolateEinstein");
          }
          if (body[0] == 'error'){
            console.log(err, body);
            return message.reply("There was an issue creating the tournament. Please contact @chocolateEinstein");
          }
/*           console.log(body);
          console.log(body.tournament);
          console.log(body[0]); */

          tournyid = body.tournament.id;
          data[message.guild].tournament = body.tournament.id;
          data[message.guild].tournamenturl = 'https://challonge.com/' + body.tournament.url;
          
            fs.writeFileSync(
                "Storage/data.json",
                JSON.stringify(data),
                (err) => {
                  //This writes the changes to the JSON
                  if (err) console.error(err);
                }
              );

            message.channel.send(`${body.tournament.name} tournament has been created! The url is https://challonge.com/${body.tournament.url}`);
            console.log(PlayerStatsAsArray);
            PlayerStatsAsArray.forEach(player => {
              console.log(player.name);
              challongeclient.participants.create({
                id: tournyid,
                participant: {
                  name: player.name,
                  seed: 1
                },
                callback: (err, body) => {
                  if (err) console.log(err, body);
                }
              });
            });
            message.channel.send(`Tournament players have been added!`);

          }
        });


    }
};