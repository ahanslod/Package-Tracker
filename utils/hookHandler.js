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
  const queryHook = function (
    query = client.dbSchemas['hook'],
    data = [tracking_code]
  ) {
    return new Promise(function (resolve, reject) {
      client.db.all(query, data, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: row[0].userid, note: row[0].note });
        }
      });
    });
  };

  const hookResults = await queryHook();

  // Send tracker update to channel id and mention user
  client.channels.cache
    .get(client.channel_id)
    .send(
      trackEmbed.createEmbed(
        carrier,
        tracking_code,
        hookResults.note,
        hookResults.id,
        message,
        lastLocation,
        lastDateTime,
        deliveryEstimate,
        public_url
      )
    );
  client.channels.cache
    .get(client.channel_id)
    .send(`Tracker Update for <@${hookResults.id}>`);
};

module.exports = {
  trackerUpdate,
};
