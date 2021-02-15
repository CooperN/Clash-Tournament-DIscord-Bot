const fs = require("fs"); //file interaction

module.exports = {
  name: 'addNewPlayerFields',
  description: 'creates a player',
  admin: true,
  shortdescription: 'Not working',
  execute(client, message, args, playerData){
    playerData[message.author.id].username =
    message.author.username;

  fs.writeFileSync(
    "Storage/playerData.json",
    JSON.stringify(playerData),
    (err) => {
      //This writes the changes to the JSON
      if (err) console.error(err);
    }
  );
  }
};


