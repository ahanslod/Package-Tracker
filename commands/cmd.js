const cmdEmbed = require('../utils/cmdEmbed');

exports.run = async (client, msg, args) => {
  msg.channel.send(cmdEmbed.createEmbed());
};

exports.help = {
  name: 'cmd',
  aliases: ['c'],
  category: 'Primary',
  description: 'List of Commands',
  usage: '.cmd',
};
