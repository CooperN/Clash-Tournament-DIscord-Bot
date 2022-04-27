const {Guild} = require("./../helpers/guild");

module.exports = {
    name: 'setadminrole',
    description: 'Sets the admin role for the guild',
    shortdescription: 'Set admin role',
    cooldown: 5,
    execute(client, message, args){
        let currentguild = new Guild(message);
        currentguild.setadminrole(args[0]);
    }
  };