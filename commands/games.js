const { google } = require("googleapis");
const googlefunctions = require("./../googlefunctions");

const config = {
  prefix: process.env.prefix,
};

const prefix = config.prefix;

var biggerscopemessage = new Object;
var biggerscopeargs = new Object;
var opponentbox = null;
var matches = new Array;
var playedmatches = new Array;
var playername = "";
var selectedweek = null;
module.exports = {
    name: 'games',
    description: 'Shows the games needing to be played for the week',
    shortdescription: 'Shows games to be played',
    usage: '[week number] [-all (for played matches)]',
    aliases: [],
    guildOnly: true,
    cooldown: 5,
    admin: false,
    execute(client, message, args, playerData, data){

      if (data.tournamentopen == true) {
        return message.reply('Sign ups are currrently open. Tournament matches will be generated when the signups have closed.');
      }
    biggerscopemessage = message;
    biggerscopeargs = args;
    matches = [];
    playedmatches = [];
    playername = "";
    playername = playerData[message.author.id].clashname;
    selectedweek = data.tournamentweek;


    if (!playerData[message.author.id].profile) {
        message.channel.send({
          embed: {
            title: "Add Clash Profile",
            //color: 0xF1C40F,
            description:
              "You have not added your profile tag. To add your profile tag type !addp playertag",
          },
        });
        return;
      }

      if(args[0] != '-all' && args[0]){
        selectedweek = parseInt(args[0]);
        if (isNaN(selectedweek)) {
          let reply = "";
            reply += ('the week input doesn\'t seem to be a valid number.');
            reply += `\nTheproper usage would be: \`${prefix}schedule [week number] [-all (for played matches)]\``;
            return message.reply(reply);
        }
      }

    googlefunctions.getcredentials(getplayerdata);
    }
  };

  function getplayerdata(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Pool Play!A2:G",
      },
      (err, res) => {
        if (err)
          return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        if (rows) {
          for(const match of rows){
            if(match[2] == playername || match[4] == playername){
                if(match[2] == playername){
                    opponentbox = 4;
                } else if(match[4] == playername) {
                    opponentbox = 2;                  
                }
                if(parseInt(match[0]) == selectedweek) {
                    if(!match[6]) {
                        matches.push([`Week ${match[0]}`, playername, match[opponentbox]]);
                    } else {
                        playedmatches.push([`Week ${match[0]}`, playername, match[opponentbox], match[6]]);
                    }
                }
                    if(parseInt(match[0]) < selectedweek) {
                        if(!match[6]) {
                            matches.push([`Week ${match[0]}`, playername, match[opponentbox]]);
                        } else {
                          playedmatches.push([`Week ${match[0]}`, playername, match[opponentbox], match[6]]);
                      }
                    }
                
            }
          }
          if(matches.length == 0){
            biggerscopemessage.channel.send(`A tournament match was not found for player ${playername}`);
          } else {
            var messagestring = "";
            var playedmessagestring = "";
            for(const match of matches){
                messagestring += `${match[0]}  ${match[1]} vs ${match[2]}\n`;
            }
            if(biggerscopeargs[0] == '-all'){
              playedmessagestring = `\nMatches that have already been played:\n`;
              for(const match of playedmatches){
                playedmessagestring += `${match[0]}  ${match[1]} vs ${match[2]} | Winner - ${match[3]}\n`;
            }
            }
            biggerscopemessage.channel.send(`Matches to be played are:\n${messagestring}${playedmessagestring}`);
          }
        }
        }

    );}