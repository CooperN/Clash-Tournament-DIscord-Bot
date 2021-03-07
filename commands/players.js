const { google } = require("googleapis");
const googlefunctions = require("./../googlefunctions");

var biggerscopemessage = new Object;
var response = "";
var spreadsheetId = null;
module.exports = {
    name: 'players',
    description: 'List of current players, their trophies and league',
    shortdescription: 'List of current players',
    guildOnly: true,
    admin: false,
    execute(client, message, args, playerData, data){
      spreadsheetId = data[message.guild].spreadsheetid;
      response = "";
      if (data[message.guild].signupopen == true) {
         response += 'Sign ups are currrently open.\n\n';
      } else {
        response += 'Sign ups are currrently closed.\n\n';
      }
    response += 'Current Signups:\n Playername - League - Best Trophies\n';

    biggerscopemessage = message;

    googlefunctions.getcredentials(getplayerdata);
    }
  };

  function getplayerdata(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: spreadsheetId,
        range: "Players!A2:F",
      },
      (err, res) => {
        if (err)
          return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        let i = 0;
        if (rows) {
          for(const match of rows){
            response += `${match[0]} - ${match[2]} - ${match[3]}\n`;  
            i++;
          }
          response += `Total: ${i}`;
            biggerscopemessage.channel.send(response);
          }
        }
    );}