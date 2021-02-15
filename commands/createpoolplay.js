const { google } = require("googleapis");
const googlefunctions = require("./../googlefunctions");
const math = require("mathjs");
var robin = require('roundrobin');

let poolplaymatches = new Array;
var biggerscopemessage = new Object;
let user = "";

module.exports = {
  name: "createpoolplay",
  description: "takes players in the tournament and makes a schedule",
  shortdescription: 'Makes new matches (deletes old)',
  guildOnly: true,
  cooldown: 10,
  admin: true,
  execute(client, message) {
    biggerscopemessage = message;
    poolplaymatches = [];
    user = message.author.username;
          googlefunctions.getcredentials(clearsheet);
          googlefunctions.getcredentials(getplayerdata);
  },
};

function getplayerdata(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Players!A2:E",
      },
      (err, res) => {
        if (err)
          return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        if (rows) {

            var topplayers = new Array;
            var midplayers = new Array;
            var bottomplayers = new Array;
            let topmatches = new Array;
            let midmatches = new Array;
            let bottommatches = new Array;


            for(const players of rows){
              topplayers.push(players); //got rid of leagues for now
                // if(players[2] == "Top Tier"){
                //     topplayers.push(players);
                // } else if(players[2] == "Mid Tier"){
                //     midplayers.push(players);
                // } else if(players[2] == "Bottom Tier"){
                //     bottomplayers.push(players);
                // }
            }

            topmatches = robin(topplayers.length, topplayers);
            midmatches = robin(midplayers.length, midplayers);
            bottommatches = robin(bottomplayers.length, bottomplayers);

            var i = 3;
            var weeknum = "";
            //sets the top bar
            poolplaymatches.push(['Week Number', 'Player 1 Discord Name', 'Player 1 Clash Name', 'Player 2 Discord Name', 'Player 2 Clash Name', 'League', 'Winner', 'Player 1 Wins', 'Player 2 Wins', 'Player 1 Towers', 'Player 2 Towers']);
            for(const weeks of topmatches){
                weeknum = `${math.floor(i/3)}`;
                for(const match of weeks){
                    poolplaymatches.push([weeknum, match[0][0], match[0][1], match[1][0], match[1][1], match[0][2]]);
                    //console.log(match);
                }
                i++;
            }
            i = 3;
            for(const weeks of midmatches){
                weeknum = `${math.floor(i/3)}`;
                for(const match of weeks){
                    poolplaymatches.push([weeknum, match[0][0], match[0][1], match[1][0], match[1][1], match[0][2]]);
                    //console.log(match);
                }
                i++;
            }
            i = 3;
            for(const weeks of bottommatches){
                weeknum = `${math.floor(i/3)}`;
                for(const match of weeks){
                    poolplaymatches.push([weeknum, match[0][0], match[0][1], match[1][0], match[1][1], match[0][2]]);
                    //console.log(match);
                }
                i++;
            }

            googlefunctions.getcredentials(setmatchdata);
        }
        }

    );}

function setmatchdata(auth) {
    const sheets = google.sheets({ version: "v4", auth });

    let values = poolplaymatches;

      let resource = {
        values,
      };
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Pool Play",
        valueInputOption: "RAW",
        resource,
      },
      (err) => {
        if (err)
          return console.log("The API returned an error: " + err);
          biggerscopemessage.channel.send(
          `Pool play matches have been created`
        );
      }
    );
  }

  function clearsheet(auth) {
    const sheets = google.sheets({ version: "v4", auth });

    sheets.spreadsheets.values.clear(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Pool Play",
      },
      (err) => {
        if (err)
          return console.log("The API returned an error: " + err);
        console.log(`poolplaysheet was cleared by ${user}`);
      }
    );
  }