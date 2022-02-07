const fetch = require("node-fetch"); //used for api calls
const discord = require("discord.js"); //discord commands

const config = {
  token: process.env.token,
  owner: process.env.owner,
  prefix: process.env.prefix,
};
const key = "Bearer " + config.token;

let playername = "";

module.exports = {
  name: 'profile',
  description: 'Displays clash profile information',
  shortdescription: 'Clash profile Info',
  aliases: ['player'],
  cooldown: 5,
  execute(client, message, args, playerData){
    if (!playerData[message.author.id].profile) {
      message.channel.send({
        embed: {
          title: "Add Clash Profile",
          //color: 0xF1C40F,
          description:
            "You have not added your profile tag. To add your profile tag type !addp playertag",
        },
      });
    } else if (playerData[message.author.id].profile) {
      let playertagurl = playerData[message.author.id].profile;
      const url = "https://api.clashroyale.com/v1/players/%23" + playertagurl;
  
      fetch(url, {
        //body:    JSON.stringify(body),
        headers: { "Content-Type": "application/json", Authorization: key },
      })
        .catch((err) => console.error(err))
        .then((res) => res.json())
        .then((json) => {
          playername = json.name;
          if (!playername) {
            message.channel.send(json.reason);
            return;
          }
  
          const exampleEmbed = new discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(
              playerData[message.author.id].clashname +
                " - Clash Profile"
            )
            // .setDescription(
            //   "You are currently set to the account " +
            //     playerData[message.author.id].clashname +
            //     ". To change your profile type !addp playertag"
            // )
            .addFields(
              { name: "Current Trophies", value: json.trophies, inline: true },
              { name: "Best Trophies", value: json.bestTrophies, inline: true },
              { name: "Clan", value: json.clan.name, inline: true },
              { name: "Battle Count", value: json.battleCount, inline: true }
            );
  
          message.channel.send(exampleEmbed);
        });
      //bottom of elseif
    }  }
};