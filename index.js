const { bot_token, easypost_token, prefixes } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

// Moment
const moment = require('moment');

//EasyPost
const EasyPost = require('@easypost/api');

// Ngrok
const ngrok = require('ngrok');

// DB Schema
const dbSchema = `CREATE TABLE IF NOT EXISTS Tracker (
  tracking_number text NOT NULL PRIMARY KEY,
  user_id integer NOT NULL,
  carrier text NOT NULL,
  note text
);`;

// SQLite3
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(
  './db/tracker.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }

    db.exec(dbSchema, (err) => {
      if (err) return console.log(err);
    });

    console.log('Connected to Tracker SQlite database.');
  }
);

db.all('SELECT * FROM Tracker', (err, rows) => {
  if (err) console.log(err);
  rows.forEach((row) => {
    console.log(row);
  });
});

// Express Hook
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/hook', (req, res) => {
  console.log(req.body);
  // Figure out what response EP uses 2XX / 200 response code
  res.status(200).end();
});

// ngrok endpoint
// let ngrokURL = '';
// app.listen(3000, () => {
//   console.log('Server listening on Port 3000');
//   (async function () {
//     ngrokURL = await ngrok.connect('3000');
//     console.log('Ngrok listening on Port 3000 and url: ' + ngrokURL);
//   })();
// });

// TEST
const api = new EasyPost(easypost_token);
const webhook = new api.Webhook({
  url: '',
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  /* -------------- Get Arguments -------------*/
  let args = '',
    note = '';

  let prefix = false;
  for (const name of prefixes) {
    if (msg.content.startsWith(name)) prefix = name;
  }

  if (!prefix) return;

  args = msg.content.slice(prefix.length).split(' ');
  note = args.slice(3, args.length).join(' ');

  /* -------------- Remove Tracking -------------*/
  if (prefix === '.remove') {
    db.run('DELETE FROM Tracker WHERE tracking_number=?', args[2], (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) deleted ${this.changes}`);
    });
    msg.channel.send(
      'Sucessfully removed ' +
        args[2] +
        ' from ' +
        client.user.username +
        "'s database."
    );
  } else if (prefix === '.watch') {
    /* -------------- Watch Tracking -------------*/
    db.run(
      'INSERT INTO Tracker (tracking_number, user_id, carrier, note) VALUES(?,?,?,?)',
      [args[2], msg.author.id, args[1], note],
      (err) => {
        if (err) console.log(err);
      }
    );

    db.all('SELECT * FROM Tracker', (err, rows) => {
      if (err) console.log(err);
      rows.forEach((row) => {
        console.log(row);
      });
    });

    if (note === '') note = 'Watch';

    getEasyPost(msg, args[2], args[1], note);
  } else if (prefix === '.track') {
    /* -------------- Track # -------------*/
    getEasyPost(msg, args[2], args[1], 'Tracking');
  } else {
    return;
  }
});

client.login(bot_token);

// GET EasyPost Data
function getEasyPost(msg, trackingID, carrierName, note) {
  const tracker = new api.Tracker({
    tracking_code: trackingID,
    carrier: carrierName,
  });

  (async () => {
    const {
      est_delivery_date,
      tracking_details,
      public_url,
    } = await tracker.save().catch((err) => console.log(err));

    // Tracking Details and Estimate
    let trackingDetails = tracking_details[tracking_details.length - 1];
    let trackingEstimate =
      est_delivery_date !== null
        ? moment(est_delivery_date).format('MMMM Do YYYY, h:mm:ss a')
        : 'N/A';

    // Get Last Location
    let trackingLocationObject =
      tracking_details[tracking_details.length - 1].tracking_location;

    let trackingLocation = Object.keys(trackingLocationObject)
      .filter((prop) => {
        return (
          trackingLocationObject[prop] != 'TrackingLocation' &&
          trackingLocationObject[prop] != null
        );
      })
      .map((prop) => {
        return trackingLocationObject[prop];
      })
      .join(', ');

    return embedMessage(
      msg,
      tracker.carrier,
      tracker.tracking_code,
      public_url,
      trackingDetails.message,
      trackingDetails.datetime,
      trackingLocation,
      trackingEstimate,
      note
    );
  })();
}

// EMBED Creator
function embedMessage(
  msg,
  carrier,
  tracking_code,
  tracking_url,
  status,
  scanDate,
  location,
  estimateDate,
  note
) {
  const embed = {
    title: carrier.toUpperCase() + ' - ' + note,
    url: tracking_url,
    color: 16746496,
    timestamp: new Date(),
    footer: {
      icon_url: 'https://i.imgur.com/jBOX9tl.png',
      text: '.track help',
    },
    thumbnail: {
      url: 'https://i.imgur.com/jBOX9tl.png',
    },
    author: {
      name: 'Package Tracker',
      url: 'https://discordapp.com',
      icon_url: 'https://i.imgur.com/jBOX9tl.png',
    },
    fields: [
      {
        name: 'Tracking #:',
        value: tracking_code,
      },
      {
        name: 'Current Status:',
        value: status,
      },
      {
        name: 'Last Scan Date:',
        value: moment(scanDate).format('MMMM Do YYYY, h:mm:ss a'),
        inline: true,
      },
      {
        name: 'Last Location:',
        value: location,
        inline: true,
      },
      {
        name: 'Estimated Delivery Date:',
        value: estimateDate,
      },
    ],
  };

  return msg.channel.send({ embed });
}
