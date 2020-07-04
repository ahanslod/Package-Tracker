const lastArrayElement = (moment, est, details) => {
  // Extract Current Status, Last Scan Date, and Last Location
  let el = details;
  const { message, datetime, tracking_location } = details[details.length - 1];

  // Format Estimate Delivery
  const deliveryEstimate =
    est !== null ? moment(est).format('MMMM Do YYYY, h:mm:ss A z') : 'N/A';

  const lastDateTime = moment(datetime).format('MMMM Do YYYY, h:mm:ss A z');

  const lastLocation = Object.keys(tracking_location)
    .filter((prop) => {
      return (
        tracking_location[prop] !== 'TrackingLocation' &&
        tracking_location[prop] !== null
      );
    })
    .map((prop) => {
      return tracking_location[prop];
    })
    .join(', ');

  return {
    message,
    lastLocation,
    lastDateTime,
    deliveryEstimate,
  };
};

module.exports = {
  lastArrayElement,
};
