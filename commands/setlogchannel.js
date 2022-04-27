const {Guild} = require("./../helpers/guild");

module.exports = {
    name: 'setlogchannel',
    description: 'Sets the channel bot logs are sent to for the guild',
    shortdescription: 'Set log channel',
    cooldown: 5,
    execute(client, message, args){
        let currentguild = new Guild(message);
        const channelid = args[0].slice(2,-1);
        currentguild.setLogChannel(channelid);
    }
  };