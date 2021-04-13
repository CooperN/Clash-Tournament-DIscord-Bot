const fs = require("fs"); //file interaction

module.exports = {
  name: 'initialGuildData',
  description: 'adds initial guild data',
  execute(client, message, args, data){
    data[message.guild] = {};
    data[message.guild].seasonnumber = 0;
    data[message.guild].tournamentweek = 0;
    data[message.guild].signupopen = false;
    data[message.guild].prefix = process.env.prefix;
    data[message.guild].adminrole = "";
    data[message.guild].notify = false;
    data[message.guild].notifyrole = "";
    data[message.guild].rename = false;
    data[message.guild].resultschannel = "";
    data[message.guild].testchannel = "";
    data[message.guild].spreadsheetid = ""; //needs a command. Access to spreadsheet info
    data[message.guild].spreadsheetlink = "";

    fs.writeFileSync(
      "Storage/data.json",
      JSON.stringify(data),
      (err) => {
        //This writes the changes to the JSON
        if (err) console.error(err);
      }
    );  }
};