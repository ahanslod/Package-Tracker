const Discord = require('discord.js');

const createEmbed = () => {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('List of Commands')
    .setURL('https://discord.js.org')
    .setAuthor(
      'Package Tracker',
      'https://i.imgur.com/jBOX9tl.png',
      'https://discord.js.org'
    )
    .setThumbnail('https://i.imgur.com/jBOX9tl.png')
    .addFields(
      {
        name: 'Track Package',
        value: '.track [carrier] [trackingNumber] [note {optional}]',
      },
      {
        name: 'Watch Package',
        value: '.watch [carrier] [trackingNumber] [note]',
      },
      { name: 'Retrieve Watch List', value: '.list' },
      {
        name: 'Remove Package from Watch List',
        value: '.remove [trackingNumber]',
      }
    )
    .setTimestamp(new Date())
    .setFooter('Commands', 'https://i.imgur.com/jBOX9tl.png');

  return embed;
};

module.exports = {
  createEmbed,
};
