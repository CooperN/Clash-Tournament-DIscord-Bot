module.exports = {
  name: 'ding',
  description: 'sends dong!',
  shortdescription: 'Sends dong!',
  cooldown: 5,
  execute(client, message){
    message.channel.send("dong!").catch(console.error);
  }
};
