const getTrackDetails = require('../utils/getTrackDetails');
const trackEmbed = require('../utils/trackEmbed');

exports.run = async (client, msg, args) => {
  console.log(args);
  const tracker = new client.EasyPost.Tracker({
    carrier: args[0],
    tracking_code: args[1],
  });

  try {
    // Deconstruct after await
    const req = await tracker.save();
    const { est_delivery_date, tracking_details, public_url } = req;
    const {
      message,
      lastLocation,
      lastDateTime,
      deliveryEstimate,
    } = getTrackDetails.lastArrayElement(
      client.moment,
      est_delivery_date,
      tracking_details
    );

    msg.channel.send(
      trackEmbed.createEmbed(
        args[0],
        args[1],
        message,
        lastLocation,
        lastDateTime,
        deliveryEstimate,
        public_url
      )
    );
  } catch (e) {
    console.log(e);
    return msg.channel.send(e.error.error.message);
  }
};

exports.help = {
  name: 'track',
  aliases: ['t', 'trk'],
  category: 'Primary',
  description: 'Track Package',
  usage: '.track [carrier] [tracking_number]',
};
