# Clash-Tournament-DIscord-Bot

Doumentation can be found at our [Website](https://coopern.github.io/Clash-Tournament-Discord-Bot/)

You can donate to run the bot [here](https://www.paypal.com/donate/?hosted_button_id=PMAB3QXG9HGC2)

## Getting Started

Add the following to root:

- .env from .env.example
  - The Below are the only required:
    - [Clash Token](developer.clashroyale.com) "Token"
    - [Discord Token](discord.com/developers/applications)
- googlecredentials.json
  - use step 1 of the [quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)
  - Change the name from credentials.json to googlecredentials.json

## ToDo

- Mute function
- ban function
- kick function
- function to set a match time to play, suggest times, accept times, have an alert
- casino games
- remind of games to played
- delete a player
- rename a player
- support multiple servers
- github documentation
- players agree to invalidate match results
  - I'm thinking one player suggest the invalidation !invalidate @otherplayer
  - Other player then reacts yes or no
    - if no then @mod to check on it and ask player to give reason - maybe post in issues
- card ban
  - after a bo3 match the loser can select a card to be banned for the rest of the bo3
