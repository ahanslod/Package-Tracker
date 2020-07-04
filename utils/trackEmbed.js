const Discord = require('discord.js');

const createEmbed = (
  carrier,
  trackingNumber,
  status,
  lastLocation,
  lastDateTime,
  deliveryEstimate,
  url
) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(carrier.toUpperCase())
    .setURL(url)
    .setAuthor(
      'Package Tracker',
      'https://i.imgur.com/jBOX9tl.png',
      'https://discord.js.org'
    )
    .setThumbnail('https://i.imgur.com/jBOX9tl.png')
    .addFields(
      { name: 'Tracking Number', value: trackingNumber },
      { name: 'Current Status', value: status },
      { name: 'Last Scanned', value: lastDateTime, inline: true },
      { name: 'Last Location', value: lastLocation, inline: true },
      { name: 'Est. Delivery Date', value: deliveryEstimate }
    )
    .setTimestamp(new Date())
    .setFooter('.cmd', 'https://i.imgur.com/jBOX9tl.png');

  return embed;
};

module.exports = {
  createEmbed,
};
