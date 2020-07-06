exports.run = async (client, msg, args) => {
  try {
    // Remove item from Watch List
    client.db.run(client.dbSchemas['remove'], args[0], function (err) {
      if (err) {
        throw err;
      }

      if (this.changes == 1) {
        msg.channel.send(
          `Removed ${args[0]} from ${client.user.username}'s Watch List`
        );
      } else {
        msg.channel.send(
          `${args[0]} does not exist in ${client.user.username}'s Watch List`
        );
      }
    });
  } catch (e) {
    console.error(e);
  }
};

exports.help = {
  name: 'remove',
  aliases: ['r'],
  category: 'Primary',
  description: 'Remove Tracking Number from Watch List',
  usage: '.remove',
};
