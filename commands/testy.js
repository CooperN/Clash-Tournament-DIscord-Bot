const googlesheets = require("../helpers/googleSheetsData");

module.exports = {
    name: 'testy',
    async execute(client, message, args, playerData, data){
        spreadsheetId = data[message.guild].spreadsheetid;
        const matchdata = await googlesheets.getTournamentMatches(spreadsheetId)
        console.log('this was a test')
    }
  };