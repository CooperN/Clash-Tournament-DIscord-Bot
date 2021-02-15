const fetch = require("node-fetch"); //used for api calls
const fs = require("fs"); //file interaction

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
  execute(client, message, args, playerData){
    const tag = args.shift();
    if (tag === "playertag") {
      message.channel.send({
        embed: {
          title: "Nice try",
          //color: 0xF1C40F,
          description:
            "Don't type the word playertag. You have to actually use yours",
        },
      });
    } else {
      let playername = "";
      let playertagurl = "";
      let name = "";
      if (message.member.nickname) {
        name = message.member.nickname;
      } else {
        name = message.member.name;
      }
      
      //check profile is correct
      if (tag.indexOf("#") !== 0) {
        playertagurl = tag;
      } else {
        playertagurl = tag.slice(1);
      }
  
      const url = "https://api.clashroyale.com/v1/players/%23" + playertagurl;
  
      fetch(url, {
        //body:    JSON.stringify(body),
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
          ///////pasted
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
          } else {
            if(message.author.username != playername && message.member.nickname != playername){
              if(message.member.roles.cache.has('725409051416199240')){
                message.channel.send('I don\'t have permission to change the nickname of an admin!');
              } else {
                  if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
                    message.channel.send('I don\'t have permission to change your nickname!');
                  } else {
                    //if admin console.log(can't rename)
                    message.member.setNickname(playername);
                    reply = (`\n\nAlso, ${message.author} your Discord name ${name} is different than your clash name ${playername}. I've fixed it for you. Say thank you.`);
                  }
              }
            }

            message.channel.send(
              `Added account to your profile with the name of ${playername}. ${reply}`
            );

            playerData[
              message.author.id
            ].clashname = playername;
            playerData[
              message.author.id
            ].profile = playertagurl;
  
            fs.writeFileSync(
              "Storage/playerData.json",
              JSON.stringify(playerData),
              (err) => {
                if (err) console.error(err);
              }
            );
          }
        });
    }
  }
};

