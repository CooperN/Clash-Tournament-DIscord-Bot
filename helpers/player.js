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
        return this.playerData[messageauthorid];
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

//new Player(messageauthorid,this.playerData[messageauthorid].username,this.playerData[messageauthorid].clashname,this.playerData[messageauthorid].profile,this.playerData[messageauthorid].money,this.playerData[messageauthorid].lastDaily)
class Player {
    constructor(message) {

        let object = playerData.getplayer(message.author.id);
        if(!object) {
            playerData.addNewPlayer(message);
            object = playerData.getplayer(message.author.id);
        }
        this.discordID = message.author.id;
        this.username = object.username;
        this.clashname = object.clashname;
        this.profile = object.profile;
        this.money = object.money;
        this.lastDaily = object.lastDaily;
    }

    getplayer(){
        this.playerData = JSON.parse(fs.readFileSync("Storage/playerData.json", "utf8"));
    }
}

let playerData = new PlayerList;

function playerlistupdate(){
    playerData.updatePlayerList();
}
module.exports = {
    Player,
    playerlistupdate
    
};
