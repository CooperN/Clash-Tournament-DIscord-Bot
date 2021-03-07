module.exports = {
  name: 'addnotify',
  description: 'adds the notify role to a player',
  guildOnly: true,
  shortdescription: 'gives the notify role',
  execute(client, message, args, playerData, data){

      let member = "";
    
      if(!data[message.guild].notifyrole){
        message.channel.send(`There is no role set for nofications. <@&${data[message.guild].adminrole}> run the command !setnotifyrole to add a notificaiton role`);
        return;
      }

      if(message.mentions.members.first()){
        member = message.mentions.members.first();
      } else{
        member = message.member;
      }

      if(member.roles.cache.has(data[message.guild].notifyrole)) {
        message.channel.send(`${playerData[message.author.id].username} already has the notify role`);
      } else {
        member.roles.add(data[message.guild].notifyrole).catch(console.error);
        message.channel.send(`Added notify role to ${playerData[message.author.id].username}`);
      }
 }
};
