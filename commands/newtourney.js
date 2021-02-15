const { google } = require("googleapis");
const googlefunctions = require("./../googlefunctions");

var biggerscopemessage = new Object;
let user = "";

module.exports = {
    name: 'newtourney',
    description: 'Clears the players entered in the tournament',
    shortdescription: 'Clears Signups',
    usage: '',
    aliases: ['clearsignups'],
    guildOnly: true,
    cooldown: 30,
    admin: true,
    execute(client, message, args, playerData){
        biggerscopemessage = message;
        user = message.author.username;
              googlefunctions.getcredentials(clearsheet);
              googlefunctions.getcredentials(setheaders);
    }
};

function setheaders(auth) {
    const sheets = google.sheets({ version: "v4", auth });

    let values = new Array;
    values.push(['Discord Name', 'Clash Name', 'League', 'Best Trophies', 'Current Trophies', 'Date Added']);

      let resource = {
        values,
      };
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Players",
        valueInputOption: "RAW",
        resource,
      },
      (err) => {
        if (err)
          return console.log("The API returned an error: " + err);
          biggerscopemessage.channel.send(
          `Signups have been cleared`
        );
      }
    );
  }

  function clearsheet(auth) {
    const sheets = google.sheets({ version: "v4", auth });

    sheets.spreadsheets.values.clear(
      {
        spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
        range: "Players",
      },
      (err) => {
        if (err)
          return console.log("The API returned an error: " + err);
        console.log(`players were cleared by ${user}`);
      }
    );
  }