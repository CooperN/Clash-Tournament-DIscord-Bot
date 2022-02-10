const { google } = require("googleapis");
const googlefunctions = require("../googlefunctions");
const objects = require("../helpers/objects");
var Promise = require('promise');



module.exports = {
    getTournamentMatches: async function(spreadsheetId){
        return new Promise(function (resolve, reject) {
            if (spreadsheetId == null) reject("Error. No spreadsheet ID")
        const test = await googlefunctions.getcredentials(getMatches, spreadsheetId)
        resolve(await googlefunctions.getcredentials(getMatches, spreadsheetId));
        }).catch(function (ex) {
            reject();
        });
    }
}

async function getMatches(auth, spreadsheetId) {
    return new Promise(function (resolve, reject) {
        const tournamentMatchs = [];
        const sheets = google.sheets({ version: "v4", auth });
        sheets.spreadsheets.values.get(
        {
            spreadsheetId: spreadsheetId,
            range: "Pool Play!A2:G",
        },
        (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const rows = res.data.values;
            if (rows) {
                for(let i = 2; i < rows.length; index++){
                    const match = rows[i];
                    const matchdata = objects.tournamentMatch(match[0],match[1],match[2],match[3],match[4],match[5], match[6], match[7], match[8], match[9], match[10])
                    tournamentMatchs.push(matchdata)
                }
            }
            resolve(tournamentMatchs)
        }
        );
    }).catch(function (ex) {
        reject();
    });
}