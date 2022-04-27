const fetch = require("node-fetch"); //used for api calls
const discord = require("discord.js"); //discord commands
const { google } = require("googleapis");
const updateleaderboard = require("../updateleaderboard");
const googlefunctions = require("./../googlefunctions");

const {checkClashProfile} = require("../helpers/functions");    

var biggerscopemessage = new Object;
var spreadsheetId = null;
var matchnumber = [];
let winner = "";
let playerWins = 0;
let opponentWins = 0;
let playerTowers = 0;
let opponentTowers = 0;
let playerName;
let opponentName;
let rownumber = 0;
let isPlayer1 = null;

module.exports = {
  name: 'results',
  description: 'sends the results from your last tournament match',
  shortdescription: 'Send match results',
  guildOnly: true,
  cooldown: 5,
  execute(client, message, args, playerData, data){

    if(!checkClashProfile.checkClashProfile(playerData[message.author.id].profile, message.channel)) return;  

    let apiurl = "https://api.clashroyale.com/v1/players/%23" + playerData[message.author.id].profile + "/battlelog";

    biggerscopemessage = message;
    spreadsheetId = data[message.guild].spreadsheetid;
    isPlayer1 = null;
    matchnumber = [];
    winner = "";
    playerWins = 0;
    opponentWins = 0;
    playerTowers = 0;
    opponentTowers = 0;
    playerName = null;
    opponentName = null;
    rownumber = 0;
    
  
      fetch(apiurl, {
        //body:    JSON.stringify(body),
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.token },
      })
        .catch((err) => console.error(err))
        .then((res) => res.json())
        .then((json) => {
          if (!json[0].gameMode.name) {
            message.channel.send(json.reason);
            return;
          }
  
          var opponent = [];
          let i = 0;
          let j = 0;
          let tournyopponent = "";
          let gamenumber = 1;
          let x = 0;
          var uniquegames = [];
          var uniquecounter = "";
          var gamesplayed = 0;
  
         for(j in json){
           if(json[j].type == 'friendly' && json[j].gameMode.name == 'Friendly'){
            if(json[j].opponent[0].name == opponent[x]){
              if(uniquecounter != opponent[x]) {
                uniquegames.push(opponent[x]);
              }
              uniquecounter = opponent[x];
                x++;
                gamenumber++;
              } else if(gamenumber > 1 ){
                x++;
                gamenumber = 1;
              }
            opponent[x] = json[j].opponent[0].name;
            matchnumber[x] = j;
           }
         }
         if(x == 0){
          message.channel.send(
            `Are you sure you've played a tournament game recently? \n Your last game was against ${json[0].opponent[0].name}. Was that part of this tournament? \n It was a ${json[0].type} match in the ${json[0].gameMode.name} gamemode. Matches in this tournament are 'friendly' \n \n The game was not logged. If this is a mistake, notify ChocolateEinstein`
          );
          return;
         } else if (uniquegames.length > 1) {
          message.channel.send(
            `You have played several friendly matches recently. I count ${uniquegames.length} that included more than one match. I will only include the most recent against ${opponent[0]}`
          );
         }
         tournyopponent = opponent[0];
         i = 0;
          while (opponent[0] === tournyopponent) {
            gamesplayed++;
            
            if (json[matchnumber[i]].team[0].crowns > json[matchnumber[i]].opponent[0].crowns) {
              playerWins++;
            } else if (json[matchnumber[i]].team[0].crowns < json[matchnumber[i]].opponent[0].crowns) {
              opponentWins++;
            }
  
            playerTowers += json[matchnumber[i]].team[0].crowns;
            opponentTowers += json[matchnumber[i]].opponent[0].crowns;
  
            i++;
            if(i == opponent.length){
              tournyopponent = "end of the list";
            }
            tournyopponent = opponent[i];
          }
          i = 0;
  
            if (playerWins > opponentWins) {
              winner = json[matchnumber[i]].team[0].name;
            } else if (opponentWins > playerWins) {
              winner = json[matchnumber[i]].opponent[0].name;
            }

            playerName = json[matchnumber[i]].team[0].name;
            opponentName = json[matchnumber[i]].opponent[0].name;
  
            const exampleEmbed = new discord.MessageEmbed()
              .setColor("#0099ff")
              .setTitle(`${json[matchnumber[i]].team[0].name} v ${json[matchnumber[i]].opponent[0].name}`)
              .setDescription(`The winner is ${winner} \n Out of ${gamesplayed} games played:`)
              .addFields(
                {
                  name: json[matchnumber[i]].team[0].name + " wins",
                  value: playerWins,
                  inline: true,
                },
                {
                  name: json[matchnumber[i]].team[0].name + " towers taken",
                  value: playerTowers,
                  inline: true,
                },
                {
                  name: json[matchnumber[i]].opponent[0].name + " wins",
                  value: opponentWins,
                  inline: true,
                },
                {
                  name: json[matchnumber[i]].opponent[0].name + " towers taken",
                  value: opponentTowers,
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

        updateleaderboard.updateleaderboard(function (err, result) {
          // *always* check for err
          if (err){
            console.log ('error', err.message, err.stack);
            message.reply(err.message);
          } else {
            console.log ('result', result);
            message.reply('Leaderboard updated');
          }
        });
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
            if(match[2] == playerName || match[2] == opponentName){
              if(match[4] == playerName || match[4] == opponentName){
                hasmatch = true;
                if(!match[6]) {
                  rownumber = i;
                  if(match[2] == playerName){
                    isPlayer1 = true;
                  } else if(match[2] == opponentName) {
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
            winner,
            playerWins,
            opponentWins,
            playerTowers,
            opponentTowers
          ],
        ];
      } else if(!isPlayer1) {
        values = [
          [
            winner,
            opponentWins,
            playerWins,
            opponentTowers,
            playerTowers
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