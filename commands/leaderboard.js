const fs = require("fs"); //file interaction
const discord = require("discord.js"); //discord commands

  module.exports = {
      name: 'leaderboard',
      description: 'Show top players',
      shortdescription: 'It\'s a leaderboard...',
      usage: '',
      aliases: ['top','ranking'],
      guildOnly: true,
      cooldown: 30,
      admin: false,
      execute(client, message, args, playerData, data){
            //change to guild.data
            if (data[message.guild].signupopen == true) {
              return message.reply('Sign ups are currrently open. Tournament matches will be generated when the signups have closed.');
            }

          // ??? am I going to use this? Looks like I already am....whoops
          let PlayerStats = JSON.parse(fs.readFileSync("Storage/playerStats.json", "utf8"));


          const PlayerStatsAsArray = Object.keys(PlayerStats[message.guild]).map(function (key) {
            PlayerStats[message.guild][key].name = key;
            return PlayerStats[message.guild][key];
          })
          .sort(function (itemA, itemB) {
            if(itemB.wins == itemA.wins && itemB.matchwins == itemA.matchwins)
            {
              return itemB.towerstaken - itemA.towerstaken;
            }
            else if(itemB.wins == itemA.wins)
            {
              return itemB.matchwins - itemA.matchwins;
            }
            else
            {
              return itemB.wins - itemA.wins;
            }
          });


          let userNames = "";
          let wins = "";
          let losses = "";
          let i = 0;

          for(const player of PlayerStatsAsArray){                    
            userNames += `\`${i + 1}\` ${player.name}\n`;
            wins += `\`${player.wins}\`\n`;
            losses += `\`${player.losses}\`\n`;
            i++;
          }

          if(args.find(element => element == '-top10')){
            // const playedmessagestring = `\n \n this command will show the top 10 only ---- once I finish it`
          }



          const embed = new discord.MessageEmbed()
          .setAuthor(`Leaderboard for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
          .setColor(0x51267)
          .addFields({ name: 'Players', value: userNames, inline: true },
            { name: 'Wins', value: wins, inline: true },
            { name: 'Losses', value: losses, inline: true });
    
            message.channel.send(embed);

      }
    };
