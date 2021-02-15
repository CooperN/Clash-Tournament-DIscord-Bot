module.exports = {
  name: 'ping',
  description: 'sends pong!',
  shortdescription: 'Sends pong!',
  cooldown: 5,
  execute(client, message, args, playerData){
    message.channel.send("pong!").catch(console.error);
  }
};