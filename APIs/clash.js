module.exports = {
    log: function(message,client) {
        console.log(message);
        if (client) {
            //client.channels.get(process.env.LOGCHANNEL).send(message);
            const channel = client.channels.cache.get("957797870831034478");
            channel.send(message);
        }
    }
};