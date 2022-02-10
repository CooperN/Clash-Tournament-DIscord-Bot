const fetch = require("node-fetch"); //used for api calls

const config = {
  token: process.env.token,
  owner: process.env.owner,
  prefix: process.env.prefix,
};
const key = "Bearer " + config.token;

module.exports = {
  name: 'addp',
  args: true,
  usage: '<clash royale playertag>',
  description: 'add a players clash profile to the bot',
  shortdescription: 'Save Clash Tag',
  execute(client, message, args, playerData, data){
    const tag = args.shift();
    if (tag === "playertag") {
      message.channel.send({
        embed: {
          title: "Nice try",
          description: "Don't type the word playertag. You have to actually use yours",
        },
      });
    } else {
      let playername = "";
      let playertagurl = "";
      let name = "";
      if (message.member.nickname) {
        name = message.member.nickname;
      } else {
        name = message.author.username;
      }
      
      //check profile is correct
      if (tag.indexOf("#") !== 0) {
        playertagurl = tag;
      } else {
        playertagurl = tag.slice(1);
      }
  
      const url = "https://api.clashroyale.com/v1/players/%23" + playertagurl;
  
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: key,
        },
      })
        .catch((err) => {
          console.error(err);
        })
        .then((res) => res.json())
        .then((json) => {
          let reply = "";
          playername = json.name;
          if (!playername) {
            if ((json.reason == "notFound")) {
              message.channel.send(
                `Could not find that player tag. Are you sure you typed it correctly?`
              );
            } else {
              message.channel.send(
                "Did not recieve the correct informtion. Error from API is -" +
                  json.reason
              );
            }
            return;
          } else { //add in guild... not rename if setting off. Rename in guild if applicable
            if(data[message.guild].rename) {
              if(name != playername){
                if(message.member.roles.cache.has('725409051416199240')){
                  message.channel.send('I don\'t have permission to change the nickname of an admin!');
                } else {
                    if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
                      message.channel.send('I don\'t have permission to change your nickname!');
                    } else {
                      //if admin console.log(can't rename)
                      message.member.setNickname(playername);
                      reply = (`\n\nAlso, ${message.author} your Discord name ${name} is different than your clash name ${playername}. That will make it hard for people to find you for games. I've fixed it for you. Say thank you.`);
                    }
                }
              }
            }

            message.channel.send(
              `Added account to your profile with the name of ${playername}. ${reply}`
            );
            playerData.addPlayerProfile(message.author.id, playername, playertagurl)
          }
        });
    }
  }
};

