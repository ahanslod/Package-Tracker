const getTrackDetails = require('../utils/getTrackDetails');
const trackEmbed = require('../utils/trackEmbed');

const trackerUpdate = async (client, json) => {
  const {
    carrier,
    tracking_code,
    est_delivery_date,
    tracking_details,
    public_url,
  } = json;

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

  // Checks if Tracking Number is unique
  const queryExist = function (
    query = client.dbSchemas['listExist'],
    data = [tracking_code]
  ) {
    return new Promise(function (resolve, reject) {
      client.db.all(query, data, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].listExist);
        }
      });
    });
  };

  if ((await queryExist()) === 0) return;

  // Get Note of the Watch List Item
  const queryNote = function (
    query = client.dbSchemas['note'],
    data = [tracking_code]
  ) {
    return new Promise(function (resolve, reject) {
      client.db.all(query, data, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row[0].note);
        }
      });
    });
  };

  //.get() with an id <client>.channels.cache.get('1234567890').send('Hello world.');
  //.find() with a function to find one by name, good for server-specific channel <guild>.channels.cache.find(ch => ch.name === 'general').send('Hello world.');
  client.channels.cache
    .get('729486355452919818')
    .send(
      trackEmbed.createEmbed(
        carrier,
        tracking_code,
        await queryNote(),
        message,
        lastLocation,
        lastDateTime,
        deliveryEstimate,
        public_url
      )
    );
};

module.exports = {
  trackerUpdate,
};
