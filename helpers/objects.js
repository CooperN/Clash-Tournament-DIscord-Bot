const fs = require("fs"); //file interaction
class PlayerList {    
    constructor(){
        try{
            this.playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
        } catch(err){
            if(err.message === "Unexpected end of JSON input"){
                this.playerData = {};
                this.saveList();
            } else {
                throw err;
            }
        }
    }

    addNewPlayer(message){
        this.playerData[message.author.id] = {}; //creates a user if they don't have one
        this.playerData[message.author.id].money = 1000; //creates money object if they don't have one
        this.playerData[message.author.id].lastDaily = "Not Collected";
        this.playerData[message.author.id].username = message.author.username;
      
        this.saveList();
    }

    addPlayerProfile(messageauthorid, clashname, profile){
        this.playerData[messageauthorid].clashname = clashname;
        this.playerData[messageauthorid].profile = profile;

        this.saveList();
    }

    getplayer(messageauthorid){
        if(!this.playerData[messageauthorid]) return false;
        return new Player(messageauthorid,this.playerData[messageauthorid].username,this.playerData[messageauthorid].clashname,this.playerData[messageauthorid].profile,this.playerData[messageauthorid].money,this.playerData[messageauthorid].lastDaily);
    }

    saveList() {
        fs.writeFileSync(
            "Storage/playerData.json",
            JSON.stringify(this.playerData),
            (err) => {
              if (err) console.error(err);
            }
          ); 

        this.updatePlayerList();
    }

    updatePlayerList() {
        this.playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
    }

}

class Player {
    constructor(discordID, username, clashName, profile, money, lastDaily) {
        this.discordID = discordID;
        this.username = username;
        this.clashName = clashName;
        this.money = money;
        this.lastDaily = lastDaily;
        this.profile = profile;
    }
}

class Guild {
    constructor(guildId, seasonnumber, tournamentweek, signupopen, prefix, adminrole, notify, notifyrole, rename, resultschannel, testchannel, spreadsheetid, spreadsheetlink) {
        this.guildId = guildId;
        this.seasonnumber = seasonnumber;
        this.tournamentweek = tournamentweek;
        this.signupopen = signupopen;
        this.prefix = prefix;
        this.adminrole = adminrole;
        this.notify = notify;
        this.notifyrole = notifyrole;
        this.rename = rename;
        this.resultschannel = resultschannel;
        this.testchannel = testchannel;
        this.spreadsheetid = spreadsheetid;
        this.spreadsheetlink = spreadsheetlink;
    }
}

class GuildData {    
    constructor(){
        this.guildData = JSON.parse(fs.readFileSync("Storage/data.json", "utf8"));
    }

    addNewGuildData(guildId) {
        this.guildData[guildId] = {};
        this.guildData[guildId].seasonnumber = 0;
        this.guildData[guildId].tournamentweek = 0;
        this.guildData[guildId].signupopen = false;
        this.guildData[guildId].prefix = process.env.prefix;
        this.guildData[guildId].adminrole = "";
        this.guildData[guildId].notify = false;
        this.guildData[guildId].notifyrole = "";
        this.guildData[guildId].rename = false;
        this.guildData[guildId].resultschannel = "";
        this.guildData[guildId].testchannel = "";
        this.guildData[guildId].spreadsheetid = ""; //needs a command. Access to spreadsheet info
        this.guildData[guildId].spreadsheetlink = "";

        this.saveGuildData();
    }

    getGuildData(guildId){
        if(!this.guildData[guildId]) return false;
        return new Guild(this.guildData[guildId].seasonnumber, this.guildData[guildId].tournamentweek, this.guildData[guildId].signupopen, this.guildData[guildId].prefix, this.guildData[guildId].adminrole, this.guildData[guildId].notify, this.guildData[guildId].notifyrole, this.guildData[guildId].rename, this.guildData[guildId].resultschannel, this.guildData[guildId].testchannel, this.guildData[guildId].spreadsheetid, this.guildData[guildId].spreadsheetlink);
    }

    getGuildPrefix(guildId){
        return this.guildData[guildId].prefix;
    }

    saveGuildData() {
        fs.writeFileSync(
            "Storage/Data.json",
            JSON.stringify(this.playerData),
            (err) => {
              if (err) console.error(err);
            }
          ); 

        this.updateGuildData();
    }

    updateGuildData() {
        this.playerData = JSON.parse(fs.readFileSync("Storage/Data.json", "utf8"));
    }

}

module.exports = {
    PlayerList,
    Player,
    GuildData,
    Guild,
    createMatchResults: function(player1, player2, winner, player1crowns, player2crowns) {
        return {
            player1,
            player2,
            winner,
            player1crowns,
            player2crowns,
        };
    },
    
    tournamentMatch: function(weekNumber, player1DiscordName, Player1ClashName, Player2DiscordName, Player2ClashName, League, Winner, Player1Wins, Player2Wins, Player1Towers, Player2Towers) {
        return {
            weekNumber,
            player1DiscordName,
            Player1ClashName,
            Player2DiscordName,
            Player2ClashName,
            League,
            Winner,
            Player1Wins,
            Player2Wins,
            Player1Towers,
            Player2Towers
        };
    }
};
