# Clash-Tournament-DIscord-Bot

## Getting Started

Run NPM init

Add the following to root:

- .env

    ```Shell
    #token for clash api
    token=eyJ0eXAiOiQ3yta21wqh0wX8p9mwoXMw
    owner=279078922736500737
    prefix=!
    myprofile=#22GYC2LL
    discordtoken=NzMyNjkxNTczMTE1Orc3NzQ4.Xw4SMw.IpSwlRcOcMgGZTP_-dli7IrPfq4
    ```

  - The Below are the only required:
    - [Clash Token](developer.clashroyale.com) "Token"
    - [Discord Token](discord.com/developers/applications)
    - prefix
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
