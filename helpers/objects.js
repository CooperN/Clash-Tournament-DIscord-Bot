const fs = require("fs"); //file interaction

function savePlayerList(playerData){
    fs.writeFileSync(
        "Storage/playerData2.json",
        JSON.stringify(playerData),
        (err) => {
          if (err) console.error(err);
        }
      ); 
}

class PlayerList {    
    constructor(){
        this.playerData = JSON.parse(fs.readFileSync("Storage/playerData2.json", "utf8"));
    }

    addNewPlayer(message){
        this.playerData[message.author.id] = {}; //creates a user if they don't have one
        this.playerData[message.author.id].money = 1000; //creates money object if they don't have one
        this.playerData[message.author.id].lastDaily = "Not Collected";
        this.playerData[message.author.id].username = message.author.username;
      
        savePlayerList(this.playerData)
    }

    addPlayerProfile(messageauthorid, clashname, profile){
        this.playerData[messageauthorid].clashname = clashname;
        this.playerData[messageauthorid].profile = profile;

        savePlayerList(this.playerData)
    }

    getplayer(messageauthorid){
        if(!this.playerData[messageauthorid]) return false
        return new Player(messageauthorid,this.playerData[messageauthorid].username,this.playerData[messageauthorid].clashname,this.playerData[messageauthorid].profile,this.playerData[messageauthorid].money,this.playerData[messageauthorid].lastDaily)
    }

    saveList() {
        savePlayerList(this.playerData)
    }
}

class Player {
    constructor(discordID, username, clashName, profile, money, lastDaily) {
        this.discordID = discordID
        this.username = username
        this.clashName = clashName
        this.money = 0
        this.lastDaily = null
        this.profile = this.profile
    }
}

module.exports = {
    PlayerList,
    Player,
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
