module.exports = {
    name: 'week',
    description: 'Displays the current tournament week',
    shortdescription: 'Display current week',
    execute(client, message, args, playerData, data){
                message.channel.send(`Current week is: Week ${data.tournamentweek}`);
    }
  };