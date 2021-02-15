module.exports = {
  name: 'addnotify',
  description: 'adds the notify role to a player',
  guildOnly: true,
  shortdescription: 'gives the notify role',
  execute(client, message, args, playerData){

      let member = "";
    
      if(message.mentions.members.first()){
        member = message.mentions.members.first();
      } else{
        member = message.member;
      }
    
      if(member.roles.cache.has('730485831630061710')) {
        message.channel.send(`${playerData[message.author.id].username} already has the notify role`);
      } else {
        member.roles.add('730485831630061710').catch(console.error);
        message.channel.send(`Added notify role to ${playerData[message.author.id].username}`);
      }
 }
};
