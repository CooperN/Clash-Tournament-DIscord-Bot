const discord = require("discord.js"); //discord commands



module.exports = {
    log: function(message) {
        console.log(message);
        discord.
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