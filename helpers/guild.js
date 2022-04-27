const fs = require("fs"); //file interaction
const {getClient} = require("./functions");
const discord = require("discord.js"); //discord commands

let logwarning = false;

class Guild {
    constructor(message) {
        let object = guildData.getGuildData(message.guild.id);
        if (!object) {
            guildData.addNewGuildData(message.guild.id);
            object = guildData.getGuildData(message.guild.id);
        }


        this.guildId = message.guild.id;
        this.seasonnumber = object.seasonnumber;
        this.tournamentweek = object.tournamentweek;
        this.signupopen = object.signupopen;
        this.prefix = object.prefix;
        this.adminrole = object.adminrole;
        this.notify = object.notify;
        this.notifyrole = object.notifyrole;
        this.rename = object.rename;
        this.resultschannel = object.resultschannel;
        this.testchannel = object.testchannel;
        this.spreadsheetid = object.spreadsheetid;
        this.spreadsheetlink = object.spreadsheetlink;
        if(object.logchannel== undefined && logwarning == false) {
            message.channel.send("No log channel set for this server. Have an admin use the setlogchannel command to set one. like this: setlogchannel #logs");
            logwarning = true;
        }
        else{
            this.logchannel = object.logchannel;
        }
    }

    getGuildPrefix() {
        return this.prefix;
    }

    getAdminRole() {
        if(!this.adminrole) {
            this.log("No admin role set for this bot. Have an admin use the setadminrole command to set one. like this: setadminrole @admin");
            return false;
        }
        return this.adminrole;
    }

    setadminrole(role) {
        this.adminrole = role;
        guildData.updateGuild(this);
    }

    // getLogChannel() {
    //     if(!this.logchannel) {
    //         return false;
    //     }
    //     return this.logchannel;
    // }

    log(message) {
        console.log(message);
        if(this.logchannel) {
            getClient().channels.fetch(this.logchannel).then(channel => {channel.send(message);});
        }
    }

    setLogChannel(channel) {
        this.logchannel = channel;
        guildData.updateGuild(this);
    }
}

class GuildData {    
    constructor(){
        try{
            this.guildData = JSON.parse(fs.readFileSync("Storage/data.json", "utf8"));
        } catch(err){
            if(err.message === "Unexpected end of JSON input"){
                this.guildData = {};
                this.saveGuildData();
            } else {
                throw err;
            }
        }
    }

    addNewGuildData(guildId) {
        this.guildData[guildId] = {};
        this.guildData[guildId].seasonnumber = 0;
        this.guildData[guildId].tournamentweek = 0;
        this.guildData[guildId].signupopen = false;
        this.guildData[guildId].prefix = "!";
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
        return this.guildData[guildId];
    }

    saveGuildData() {
        fs.writeFileSync(
            "Storage/Data.json",
            JSON.stringify(this.guildData),
            (err) => {
              if (err) console.error(err);
            }
          ); 

        this.updateGuildData();
    }

    updateGuildData() {
        this.guildData = JSON.parse(fs.readFileSync("Storage/Data.json", "utf8"));
    }

    updateGuild(Guild) {
        this.guildData[Guild.guildId] = Guild;
        this.saveGuildData();
    }
}

let guildData = new GuildData;

function guildDataUpdate(){
    guildData.updateGuildData();
}

module.exports = {
    Guild,
    guildDataUpdate
};
