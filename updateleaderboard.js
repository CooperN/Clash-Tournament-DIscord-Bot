const { google } = require("googleapis");
const googlefunctions = require("./googlefunctions");
const fs = require("fs"); //file interaction
let guild = null;
module.exports = {
    updateleaderboard: function(guildid) {
      guild = guildid;
        googlefunctions.getcredentials(getplayerdata);
    }
};

function getplayerdata(auth) {

    let data = JSON.parse(fs.readFileSync("Storage/data.json", "utf8"));
    var PlayerStats = JSON.parse(fs.readFileSync("Storage/playerStats.json", "utf8"));
    PlayerStats[guild] = {};
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: data[guild].spreadsheetid,
        range: "Pool Play!A2:K",
      },
      (err, res) => {
        if (err)
          return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        if (rows) {
          for(const match of rows){
            if (!PlayerStats[guild][match[2]]){
              PlayerStats[guild][match[2]] = {};
              PlayerStats[guild][match[2]].wins = 0;
              PlayerStats[guild][match[2]].losses = 0;
              PlayerStats[guild][match[2]].matchwins = 0;
              PlayerStats[guild][match[2]].matchlosses = 0;
              PlayerStats[guild][match[2]].towerstaken = 0;
              PlayerStats[guild][match[2]].towerslost = 0;
            }
            if (!PlayerStats[guild][match[4]]){
              PlayerStats[guild][match[4]] = {};
              PlayerStats[guild][match[4]].wins = 0;
              PlayerStats[guild][match[4]].losses = 0;
              PlayerStats[guild][match[4]].matchwins = 0;
              PlayerStats[guild][match[4]].matchlosses = 0;
              PlayerStats[guild][match[4]].towerstaken = 0;
              PlayerStats[guild][match[4]].towerslost = 0;
            }
          }
          let loser = "";
          for(const match of rows){
                if(parseInt(match[0])) {
                    if(match[6]) {
                      let winner = match[6];
                      let player1 = match[2];
                      let player2 = match[4];
                      if(match[2] != match[6]){
                        loser = match[2];
                      } else if(match[4] != match[6]) {
                        loser = match[4];                 
                      }
                      PlayerStats[guild][winner].wins += 1;
                      PlayerStats[guild][loser].losses += 1;
                      PlayerStats[guild][player1].matchwins += Number(match[7]);
                      PlayerStats[guild][player2].matchwins += Number(match[8]);
                      PlayerStats[guild][player2].matchlosses += Number(match[7]);
                      PlayerStats[guild][player1].matchlosses += Number(match[8]);
                      PlayerStats[guild][player1].towerstaken += Number(match[9]);
                      PlayerStats[guild][player2].towerstaken += Number(match[10]);
                      PlayerStats[guild][player1].towerslost += Number(match[10]);
                      PlayerStats[guild][player2].towerslost += Number(match[9]);
                }
          }
        }

          if(PlayerStats[guild].length == 0){
            return `No Matches have been played. Get going!`;
          } else {
            fs.writeFileSync(
              "Storage/playerStats.json",
              JSON.stringify(PlayerStats),
              (err) => {
                //This writes the changes to the JSON
                if (err) console.error(err);
              }
            );
          }
        }
      }
    );}

