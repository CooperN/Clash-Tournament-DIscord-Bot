module.exports = {
  name: 'stopnotify',
  description: 'removes the notify role from the player',
  shortdescription: 'Remove notify role',
  guildOnly: true,
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

      if(!member.roles.cache.has(data[message.guild].notifyrole)) {
        message.channel.send(`${playerData[message.author.id].username} doesn't have the notify role`);
      } else {
        member.roles.remove(data[message.guild].notifyrole).catch(console.error);
        message.channel.send(`Remove notify role from ${playerData[message.author.id].username}`);
      }
 }
};
