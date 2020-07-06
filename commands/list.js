const listEmbed = require('../utils/listEmbed');

exports.run = async (client, msg, args) => {
  try {
    // List all packages inside Watch List
    client.db.all(client.dbSchemas['list'], [], (err, rows) => {
      if (err) {
        throw err;
      }
      if (!Array.isArray(rows) || !rows.length)
        return msg.channel.send('Empty Watch List');
      const list = rows.map((row) => {
        return { name: row.note, value: row.tracking_number };
      });
      console.log(list);
      msg.channel.send(listEmbed.createEmbed(list));
    });
  } catch (e) {
    console.error(e);
  }
};

exports.help = {
  name: 'list',
  aliases: ['l'],
  category: 'Primary',
  description: 'Watch List',
  usage: '.list',
};
