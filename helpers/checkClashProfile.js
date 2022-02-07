
module.exports = {
  name: 'checkClashProfile',
  description: 'checks to see if the clash profile is null',
  checkClashProfile: function(profile, channel) {
    if (!profile) {
        channel.send({
          embed: {
            title: "Add Clash Profile",
            //color: 0xF1C40F,
            description:
              "You have not added your profile tag. To add your profile tag type !addp playertag",
          },
        });
      } else return true;
    }
};