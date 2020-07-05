const getTrackDetails = require('../utils/getTrackDetails');
const trackEmbed = require('../utils/trackEmbed');

exports.run = async (client, msg, args) => {
  const tracker = new client.EasyPost.Tracker({
    carrier: args[0],
    tracking_code: args[1],
  });

  try {
    // Deconstruct after await
    const req = await tracker.save().catch((err) => {
      throw err;
    });
    // console.log(req);
    if (req.status === 'unknown') throw 'Unknown Tracking Number';

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
        args[2],
        message,
        lastLocation,
        lastDateTime,
        deliveryEstimate,
        public_url
      )
    );
    return false;
  } catch (e) {
    console.log(e);
    msg.channel.send(
      'Please confirm that both the carrier and tracking number are correct.'
    );
    return true;
  }
};

exports.help = {
  name: 'track',
  aliases: ['t', 'trk'],
  category: 'Primary',
  description: 'Track Package',
  usage: '.track [carrier] [tracking_number] [note {optional}]',
};
