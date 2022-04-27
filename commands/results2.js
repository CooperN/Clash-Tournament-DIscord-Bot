const fetch = require("node-fetch"); //used for api calls
const discord = require("discord.js"); //discord commands
const { google } = require("googleapis");
const updateleaderboard = require("../updateleaderboard");
const googlefunctions = require("../googlefunctions");

const functions = require("../helpers/functions");    
const results = require("./results");

module.exports = {
  name: 'results2',
  description: 'sends the results from your last tournament match',
  shortdescription: 'Send match results',
  guildOnly: true,
  cooldown: 5,
  execute(client, message, args, playerData, data){

    if(!functions.checkClashProfile(playerData[message.author.id].profile, message.channel)) return;  

    apiurl = "https://api.clashroyale.com/v1/players/%23" + playerData[message.author.id].profile + "/battlelog";

    spreadsheetId = data[message.guild].spreadsheetid;
    isPlayer1 = null;
    matchnumber = [];
    rownumber = 0;
    results = {
      playerWins: 0,
      opponentWins: 0,
      playerTowers: 0,
      opponentTowers,
      winner: "",
      playername: "",
      opponentName: ""
    }
    
  
    fetch(apiurl, {headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.token },})
      .catch((err) => console.error(err))
      .then((res) => res.json())
      .then((json) => {
        //exit if the api returned no data
        if (!json[0].gameMode.name) {
          message.channel.send(json.reason);
          return;
        }

        let j = 0
        let matches = [];
        let opponent = ""
        
        //look for the first 3 matches with the most recent opponent
        while(matches.length < 3){
          if(json[j].type == 'friendly' && json[j].gameMode.name == 'Friendly'){
            if(length(matches) == 0){
              opponent = json[j].opponent[0].name
            }
            if(json[j].opponent[0].name == opponent){
              matches.push(json[j])
            }
          }
        }
        //if no matches were found send a message and exit
        if(length(matches) == 0){
          message.channel.send(`Are you sure you've played a tournament game recently? \n Your last game was against ${json[0].opponent[0].name}. Was that part of this tournament? \n It was a ${json[0].type} match in the ${json[0].gameMode.name} gamemode. Matches in this tournament are 'friendly' \n \n The game was not logged. If this is a mistake, notify an admin`);
          return;
        }

        for (let i = 0; i < matches.length; i++) {
          //record each match winner
          if (matches[i].team[0].crowns > matches[i].opponent[0].crowns) {
            results.playerWins++;
          } else if (json[matchnumber[i]].team[0].crowns < json[matchnumber[i]].opponent[0].crowns) {
            results.opponentWins++;
          }
          //record match towers
          results.playerTowers += matches[i].team[0].crowns;
          results.opponentTowers += matches[i].opponent[0].crowns;
        }
        //calculate winner
        if (results.playerWins>results.opponentWins) {
          results.winner = matches[0].team[0].name
        } else if (results.opponentWins>results.playerWins) {
          results.winner = matches[0].opponent[0].name;
        }

        results.playerName = matches[0].team[0].name;
        results.opponentName = matches[0].opponent[0].name;

        const exampleEmbed = new discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`${results.playerName} v ${results.opponentName}`)
          .setDescription(`The winner is ${results.winner}`)
          .addFields(
            {
              name: results.playerName + " wins",
              value: results.playerWins,
              inline: true,
            },
            {
              name: results.playerName + " towers taken",
              value: results.playerTowers,
              inline: true,
            },
            {
              name: results.opponentName + " wins",
              value: results.opponentWins,
              inline: true,
            },
            {
              name: results.opponentName + " towers taken",
              value: results.opponentTowers,
              inline: true,
            }
          );
        
          googlefunctions.getcredentials(getplayerdata);

          message.channel.send(exampleEmbed);
          const resultschannel = client.channels.cache.get(data[message.guild].resultschannel);            
          if(message.channel.id != data[message.guild].testchannel){
            resultschannel.send(exampleEmbed);
          }
      });

      let badresult = updateleaderboard.updateleaderboard(message.guild);      

      if (badresult) //will be populated if no matches were found
        return message.channel.send(badresult);
  }
};

function getplayerdata(auth) {
  let alreadyplayed = false;
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: spreadsheetId,
        range: "Pool Play!A2:G",
      },
      (err, res) => {
        if (err)
          return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        var hasmatch = false;
        if (rows) {
          var i = 2;
          for(const match of rows){
            if(match[2] == results.playerName || match[2] == results.opponentName){
              if(match[4] == results.playerName || match[4] == results.opponentName){
                hasmatch = true;
                if(!match[6]) {
                  rownumber = i;
                  if(match[2] == results.playerName){
                    isPlayer1 = true;
                  } else if(match[2] == results.opponentName) {
                    isPlayer1 = false;                  
                  }
                  googlefunctions.getcredentials(setmatchdata);
                } else {
                  biggerscopemessage.channel.send(`This game has already been recorded. If the values need changed contact @admin.`);
                  alreadyplayed = true;
                }
              }
            }
            i++;
          }
          if(!hasmatch && !alreadyplayed){
            biggerscopemessage.channel.send(`A tournament match was not found for these players. If this is an error message @admin`);
          }
        }
        }

    );}

    function setmatchdata(auth) {
      const sheets = google.sheets({ version: "v4", auth });
      let values = new Array;
      if(isPlayer1){
        values = [
          [
            results.winner,
            results.playerWins,
            results.opponentWins,
            results.playerTowers,
            results.opponentTowers
          ],
        ];
      } else if(!isPlayer1) {
        values = [
          [
            results.winner,
            results.opponentWins,
            results.playerWins,
            results.opponentTowers,
            results.playerTowers
          ],
        ];
      } else {
        biggerscopemessage.channel.send(`An error occured in reading player information. Contact ChocolateEinstein`);
        return;
      }

  
        let resource = {
          values,
        };
      sheets.spreadsheets.values.update(
        {
          spreadsheetId: spreadsheetId,
          range: `Pool Play!G${rownumber}`,
          valueInputOption: "RAW",
          resource,
        },
        (err) => {
          if (err)
            return console.log("The API returned an error: " + err);
            biggerscopemessage.channel.send(
            `Spreadsheet has been updated`
          );
        }
      );
    }