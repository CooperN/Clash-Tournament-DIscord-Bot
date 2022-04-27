class match {
    constructor(weekNumber, player1DiscordName, Player1ClashName, Player2DiscordName, Player2ClashName, League = null, Winner = null, Player1Wins = null, Player2Wins = null, Player1Towers = null, Player2Towers = null) {
        this.weekNumber = weekNumber;
        this.player1DiscordName = player1DiscordName;
        this.Player1ClashName = Player1ClashName;
        this.Player2DiscordName = Player2DiscordName;
        this.Player2ClashName = Player2ClashName;
        this.League = League;
        this.Winner = Winner;
        this.Player1Wins = Player1Wins;
        this.Player2Wins = Player2Wins;
        this.Player1Towers = Player1Towers;
        this.Player2Towers = Player2Towers;
    },
    
}


module.exports = {
    match,
    
    
    createMatchResults: function(player1, player2, winner, player1crowns, player2crowns) {
        return {
            player1,
            player2,
            winner,
            player1crowns,
            player2crowns,
        };
    },
};

function tournamentMatch(weekNumber, player1DiscordName, Player1ClashName, Player2DiscordName, Player2ClashName, League, Winner, Player1Wins, Player2Wins, Player1Towers, Player2Towers) {
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