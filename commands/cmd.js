const trackEmbed = require('../utils/cmdEmbed');

exports.run = async (client, msg, args) => {
  msg.channel.send(trackEmbed.createEmbed());
};

exports.help = {
  name: 'cmd',
  aliases: ['c'],
  category: 'Primary',
  description: 'List of Commands',
  usage: '.cmd',
};
