const fs = require("fs"); //file interaction
const fetch = require("node-fetch"); //used for api calls

module.exports = {
  name: 'update cards',
  description: 'updates the card storage from the api',
  execute(client, message, args, playerData){
    const url = "https://api.clashroyale.com/v1/cards";

    fetch(url, {
      //body:    JSON.stringify(body),
      headers: { "Content-Type": "application/json", Authorization: key },
    })
      .catch((err) => console.error(err))
      .then((res) => res.json())
      .then((json) => {

        fs.writeFileSync(
          "Storage/playerStats.json",
          JSON.stringify(PlayerStats),
          (err) => {
            //This writes the changes to the JSON
            if (err) console.error(err);
          }
        );

        console.log("Card json storage has been updated")
      });

    }
};
