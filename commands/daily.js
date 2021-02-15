const moment = require("moment"); //date and time -- used in money stuff
const fs = require("fs"); //file interaction

module.exports = {
  name: 'daily',
  description: 'adds daily income to bank balance',
  shortdescription: 'Daily Income',
  guildOnly: true,
  execute(client, message, args, playerData){
    if (
      playerData[message.author.id].lastDaily !=
      moment().format("L")
    ) {
      // checks if it's the current date
      playerData[
        message.author.id
      ].lastDaily = moment().format("L"); //sets the current day
      playerData[message.author.id].money += 500; //adds 500 to their account
      message.channel.send({
        embed: {
          title: "Daily Reward",
          color: 0xf1c40f,
          description: "You got $500 added to your account!",
        },
      });
    } else {
      message.channel.send({
        embed: {
          title: "Daily Reward",
          color: 0xf1c40f,
          description:
            "You already collected your daily reward! You can collect your next reward " +
            moment().endOf("day").fromNow() +
            ".",
        },
      });
    }
  
    fs.writeFileSync(
      "Storage/playerData.json",
      JSON.stringify(playerData),
      (err) => {
        //This writes the changes to the JSON
        if (err) console.error(err);
      }
    );  }
};
