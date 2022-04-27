const {Guild} = require("./guild");

let currentClient

function log(message) {
    console.log(message);

    let currentGuild = new Guild(message);
    let logchannel = currentGuild.getLogChannel();
    if (!logchannel) {
        message.reply("No log channel set for this server. Use the setlogchannel command to set one. like this: setlogchannel #logs");
    }
    else {
        logchannel.send(message);
    }
}

function getClient() {
    return currentClient;
}
function saveClient(client) {
    currentClient = client;
}

function checkClashProfile(profile, channel) {
    if (!profile) {
        channel.send({
          embed: {
            title: "Add Clash Profile",
            //color: 0xF1C40F,
            description:
              "You have not added your profile tag. To add your profile tag type !addp playertag",
          },
        });
      } else return true;
    }

function createMatchResults(player1, player2, winner, player1crowns, player2crowns) {
    return {
        player1,
        player2,
        winner,
        player1crowns,
        player2crowns,
    };
}

module.exports = {
    log,
    checkClashProfile,
    createMatchResults,
    getClient,
    saveClient
};