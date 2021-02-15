const fetch = require("node-fetch"); //used for api calls
const { google } = require("googleapis");
const googlefunctions = require("./../googlefunctions");

const config = {
  token: process.env.token,
  owner: process.env.owner,
  prefix: process.env.prefix,
};

const key = "Bearer " + config.token;



module.exports = {
  name: "join",
  description: "adds player to the tournament",
  shortdescription: 'Sign up for Tourney',
  guildOnly: true,
  execute(client, message, args, playerData, data) {
    var playername = "";
    var numleague = 0;
    var league = "";
    let member = "";
    let index = null;
    let name = "";

    // change to guild
    if (!data.signupopen) return message.reply('sign ups are not currently open');

      if (message.mentions.members.first()) {
        member = message.mentions.members.first();
      } else {
        member = message.member;
      }

      if (member.nickname) {
        name = member.nickname;
      } else {
        name = member.name;
      }

      if (!playerData[member.id].profile) {
        return message.channel.send({
          embed: {
            title: "Add Clash Profile",
            //color: 0xF1C40F,
            description:
              `${name} has not added a profile tag. To add your profile tag type !addp playertag`,
          },
        });
      }

      if (member.roles.cache.has("774383232824639498")) {
        league += "Top Tier";
        numleague += 1;
      }
      if (member.roles.cache.has("732627458444230666")) {
        league += "Mid Tier";
        numleague += 1;
      }
      if (member.roles.cache.has("732627544871796746")) {
        league += "Bottom Tier";
        numleague += 1;
      }
      if (numleague == 0) {
        return message.channel.send(
          `${playername} is not in a league. <@&725409051416199240> add player to a league \n \n ${playername} please run the !profile command to show your current trophies`
        );
      } else if (numleague > 1) {
        return message.channel.send(
          `${playername} is in more than one league. <@&725409051416199240> remove player from one of the leagues`
        );
      }

      let playertagurl =
        playerData[member.id].profile;
      const url = "https://api.clashroyale.com/v1/players/%23" + playertagurl;

      fetch(url, {
        headers: { "Content-Type": "application/json", Authorization: key },
      })
        .catch((err) => console.error(err))
        .then((res) => res.json())
        .then((json) => {
          playername = json.name;
          if (!playername) {
            message.channel.send(json.reason);
            return;
          }
          var best_trophies = json.bestTrophies;
          var current_trophies = json.trophies;
          var discord_name =
            playerData[member.id].username;
          var clash_name = playername;
          var d = new Date();
          var n = d.getTime();

          //////////////////////////////////
          googlefunctions.getcredentials(getplayerdata);

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
                  if (rows.length) {
                    //console.log('Discord Name, Clash Name, League, Best Trophies, Current Trophies:');
                    for (var i=0; i < rows.length; i++) {
                      // console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`);
                      if (discord_name.toString() == rows[i][0].toString()) {
                        if (league.toString().trim() != rows[i][2].toString()) {
                          index = i;
                          message.reply('is already in the tournament, but in a different league. I\'ll update it to the new one.');
                        } else if (clash_name != rows[i][1].toString()) {
                          index = i;
                          message.reply('is already in the tournament, but has the incorrect name. I\'ll update it to the new one.');
                        } else {
                          return message.reply('is already in the tournament');
                        }

                      }
                    }
                  }
                }
                  googlefunctions.getcredentials(setplayerdata);
              }
            );
          }

          function setplayerdata(auth) {
            const sheets = google.sheets({ version: "v4", auth });

            let values = [
              [
                discord_name,
                clash_name,
                league,
                best_trophies,
                current_trophies,
                n,
              ],
            ];

            let resource = {
              values,
            };



            if (index == null) {
              let range = "Players!A2";
              sheets.spreadsheets.values.append(
                {
                  spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
                  range,
                  valueInputOption: "RAW",
                  resource,
                },
                (err, res) => {
                  if (err)
                    return console.log("The API returned an error: " + err);
                  console.log(`${res.updatedCells} cells updated. Added ${discord_name} to the tournament.`);
                  message.channel.send(
                    `${playername} has been added to the tournament!`
                  );
                }
              );
            } else if (index != null) {
              let range = `Players!A${index + 2}`;
              sheets.spreadsheets.values.update(
                {
                  spreadsheetId: "1k-XqY4xWr26uyhSsqhoyvXaQb-GIOczRtXfvJaH8-nM",
                  range,
                  valueInputOption: "RAW",
                  resource,
                },
                (err, res) => {
                  if (err)
                    return console.log("The API returned an error: " + err);
                  console.log(`${res.data.updatedCells} cells updated. Changed the league of ${discord_name} in the tournament.`);
                  message.channel.send(
                    `${playername} has been updated in the tournament!`
                  );
                }
              );
            } else {
              message.channel.send(
                `There was an issue updating your data. Please constact @ChocolateEinstein`
              );
            }

          //////////////////////////////////
          }
        });
  },
};
