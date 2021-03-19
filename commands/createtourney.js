const updateleaderboard = require("../updateleaderboard");
const axios = require('axios'); //used for api posts

module.exports = {
    name: 'createtourney',
    description: 'Creates a new tournament',
    shortdescription: 'Creates a new tournament',
    usage: '',
    aliases: ['newtourney','createtournament','newtournament','crt'],
    guildOnly: true,
    cooldown: 30,
    admin: true,
    execute(client, message, args, playerData){
      let badresult = updateleaderboard.updateleaderboard(message.guild);      

      if (badresult) 
        return message.channel.send(badresult);
      else
        message.channel.send("Leaderboard has been updated for the tourney!");

      const baseurl = 'https://api.challonge.com/v1/';
      const endpoint = "tournaments";
      const test = baseurl + endpoint;
      
      axios
        .post(test, {},{params: {
          "api_key": process.env.challongetoken
        }, headers: {"Accept":'*/*'}})
        .then(res => {
          console.log(`statusCode: ${res.statusCode}`);
          console.log(res);
        })
        .catch(error => {
          console.error(error);
          console.log('it broke');
        });

    }

};