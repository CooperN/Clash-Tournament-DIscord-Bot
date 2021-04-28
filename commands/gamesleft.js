const { google } = require("googleapis");
const googlefunctions = require("../googlefunctions");

var biggerscopemessage = new Object;
var biggerscopeargs = new Object;
var matches = new Array;
var playedmatches = new Array;
var selectedweek = null;
var spreadsheetId;
  module.exports = {
      name: 'gamesleft',
      description: 'Shows all remaining games for the selected week',
      shortdescription: 'All remaining games',
      usage: '[week number] [-all (for played matches)]',
      aliases: [],
      guildOnly: true,
      cooldown: 10,
      admin: true,
      execute(client, message, args, playerData, data){

            if (data[message.guild].signupopen == true) {
              return message.reply('Sign ups are currrently open. Tournament matches will be generated when the signups have closed.');
            }
          biggerscopemessage = message;
          biggerscopeargs = args;
          spreadsheetId = data[message.guild].spreadsheetid;
          matches = [];
          playedmatches = [];
          selectedweek = data[message.guild].tournamentweek;
          let reply = "";

          if(args[0] != '-all' && args[0]){
            selectedweek = parseInt(args[0]);
            if (isNaN(selectedweek)) {
                reply += ('the week input doesn\'t seem to be a valid number.');
                reply += `\nTheproper usage would be: \`${data[message.guild].prefix}schedule [week number] [-all (for played matches)]\``;
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
              spreadsheetId: spreadsheetId,
              range: "Pool Play!A2:G",
            },
            (err, res) => {
              if (err)
                return console.log("The API returned an error: " + err);
              const rows = res.data.values;
              if (rows) {
                for(const match of rows){
                      if(parseInt(match[0]) <= selectedweek) {
                          if(!match[6]) {
                              matches.push([`Week ${match[0]}`, match[2], match[4]]);
                          } else {
                              playedmatches.push([`Week ${match[0]}`, match[2], match[4], match[6]]);
                          }
                      }
                }
              }
                if(matches.length == 0){
                  biggerscopemessage.channel.send(`All tournament matches have been played for weeks ! Yay!`);
                } else {
                  var messagestring = "";
                  var playedmessagestring = "";
                  for(const match of matches){
                      messagestring += `${match[0]}  ${match[1]} vs ${match[2]}\n`;
                  }
                  if(biggerscopeargs.find(element => element == '-all')){
                    playedmessagestring = `\nMatches that have already been played:\n`;
                    for(const match of playedmatches){
                      playedmessagestring += `${match[0]}  ${match[1]} vs ${match[2]} | Winner - ${match[3]}\n`;
                    }
                  }
                  console.log(`Matches to be played are:\n${messagestring}${playedmessagestring}`);
                  console.log(`Matches to be played are:\n${messagestring}${playedmessagestring}`.length);
                  
                  let lists = chunkSubstr(`Matches to be played are:\n${messagestring}${playedmessagestring}`, 2000);
                  console.log(lists);
                  for(const list in lists){
                    biggerscopemessage.channel.send(lists[list]);
                  }
                }
              }
          );}

          function chunkSubstr(str, size) {
            const numChunks = Math.ceil(str.length / size);
            const chunks = new Array(numChunks);
          
            for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
              chunks[i] = str.substr(o, size);
            }
          
            return chunks;
          }