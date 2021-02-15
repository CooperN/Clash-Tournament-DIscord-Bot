module.exports = {
  name: 'say',
  args: true,
  admin: true,
  usage: '<any text to say>',
  description: 'says the text after',
  shortdescription: 'Bot says your message',
  execute(client, message, args, playerData){
    const response = args.join(" ");
    message.delete();
    message.channel.send(response);  }
};

