let bigclientscope = new Object; 

module.exports = {
  name: 'renameplayers',
  description: 'renames all current players',
  shortdescription: 'Not Working!!',
  admin: true,
  execute(client, message, args, playerData){
    bigclientscope = client;
    playerData.forEach(renameplayer);

  }
};

function renameplayer(player) {
  let playername = "";
  if (playerData[message.author.id].profile) {
    let playertagurl = playerData[message.author.id].profile;
    const url = "https://api.clashroyale.com/v1/players/%23" + playertagurl;

    fetch(url, {
      //body:    JSON.stringify(body),
      headers: { "Content-Type": "application/json", Authorization: key },
    })
      .catch((err) => console.error(err))
      .then((res) => res.json())
      .then((json) => {
        playername = json.name;
        if (!playername) {
          message.channel.send(json.reason);
          return;
        }
        if(message.member.nickname != playername){
          if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
            message.channel.send('I don\'t have permission to change your nickname!');
          } else {
            message.member.setNickname(playername);
            reply = (`${player.username} your Discord name is different than your clash name ${playername}. I've fixed it for you. Say thank you.`);
          }
        }
      });

  bigclientscope.fetchUser(player); //what is this?

}
}