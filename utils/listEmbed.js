const Discord = require('discord.js');

const createEmbed = (list) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Watch List')
    .setURL('https://discord.js.org')
    .setAuthor(
      'Package Tracker',
      'https://i.imgur.com/jBOX9tl.png',
      'https://discord.js.org'
    )
    .setThumbnail('https://i.imgur.com/jBOX9tl.png')
    .addFields(list)
    .setTimestamp(new Date())
    .setFooter('.cmd for commands', 'https://i.imgur.com/jBOX9tl.png');

  return embed;
};

module.exports = {
  createEmbed,
};
