module.exports = {
  name: 'stopnotify',
  description: 'removes the notify role from the player',
  shortdescription: 'Remove notify role',
  guildOnly: true,
  execute(client, message, args, playerData){

      let member = "";
    
      if(message.mentions.members.first()){
        member = message.mentions.members.first();
      } else{
        member = message.member;
      }

      if(!member.roles.cache.has('730485831630061710')) {
        message.channel.send(`${playerData[message.author.id].username} doesn't have the notify role`);
      } else {
        member.roles.remove('730485831630061710').catch(console.error);
        message.channel.send(`Remove notify role from ${playerData[message.author.id].username}`);
      }
 }
};
