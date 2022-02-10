const objects = require("../helpers/objects")

module.exports = {
  name: 'balance',
  description: 'sends player bank account balance',
  guildOnly: true,
  aliases: ['bank', 'money'],
  shortdescription: 'Bank Balance',
  execute(client, message, args, playerData){
    message.channel.send({
      embed: {
        title: "Bank",
        color: 0xf1c40f,
        fields: [
          {
            name: "Account Holder",
            value: message.author.username,
            inline: true,
          },
          {
            name: "Account Balance",
            value: playerData[message.author.id].money,
            inline: true,
          },
        ],
      },
    });  }
};
