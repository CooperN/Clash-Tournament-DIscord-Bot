
module.exports = {
    log: function(message,client) {
        console.log(message);
        if (client) {
            //client.channels.get(process.env.LOGCHANNEL).send(message);
            const channel = client.channels.cache.get("957797870831034478");
            channel.send(message);
        }
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