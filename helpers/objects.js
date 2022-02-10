const fs = require("fs"); //file interaction

export class PlayerList {
    constructor(){
        this.playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
    }

    addPlayer(message, playerData){
        this.playerData[message.author.id] = {}; //creates a user if they don't have one
        this.playerData[message.author.id].money = 1000; //creates money object if they don't have one
        this.playerData[message.author.id].lastDaily = "Not Collected";
        this.playerData[message.author.id].username = message.author.username;
      
        fs.writeFileSync(
          "Storage/playerData.json",
          JSON.stringify(this.playerData),
          (err) => {
            if (err) console.error(err);
          }
        );  
    }

    saveList() {
        fs.writeFileSync(
            "Storage/playerData.json",
            JSON.stringify(this.playerData),
            (err) => {
              if (err) console.error(err);
            }
          ); 
    }
}

export class Player {
    constructor(username, clashName, profile) {
        this.username = username
        this.clashName = clashName
        this.money = 0
        this.lastDaily = null
        this.profile = this.profile
    }

    saveplayer(){
        //saves to the json array
    }
    getPlayer(){
        //gets player info from json based on clash name or discord name
    }


}
module.exports = {
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
