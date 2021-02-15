const fs = require("fs"); //file interaction

module.exports = {
  name: 'initialPlayerData',
  description: 'adds initial player data - this will wipe your bank account',
  execute(client, message, args, playerData){
    playerData[message.author.id] = {}; //creates a user if they don't have one
    playerData[message.author.id].money = 1000; //creates money object if they don't have one
    playerData[message.author.id].lastDaily = "Not Collected";
    playerData[message.author.id].username =
      message.author.username;
  
    fs.writeFileSync(
      "Storage/playerData.json",
      JSON.stringify(playerData),
      (err) => {
        //This writes the changes to the JSON
        if (err) console.error(err);
      }
    );  }
};
