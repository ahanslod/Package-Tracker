exports.run = async (client, msg, args) => {
  // Get tracker {checks if error} then continue
  const tracker = await client.commands.get('track').run(client, msg, args);
  if (tracker) {
    return msg.channel.send(
      'Could not monitor the package - check your details and try again'
    );
  }

  const note = args[2] === undefined ? msg.author.username : args[2];

  // Checks if Tracking Number is exists in Watch List
  const queryExist = function (
    query = client.dbSchemas['listExist'],
    data = [args[1]]
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

  if ((await queryExist()) > 0)
    return msg.channel.send(`${args[1]} is already in Watch List`);

  // Checks if Watch List is full
  const queryList = function (
    query = client.dbSchemas['listCount'],
    data = []
  ) {
    return new Promise(function (resolve, reject) {
      client.db.all(query, data, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].listCount);
        }
      });
    });
  };

  if ((await queryList()) > 9)
    return msg.channel.send('Watch List Full - Maximum of 10 Trackers');

  // Inserts new Tracker into watch list
  const queryInsert = function (
    query = client.dbSchemas['watch'],
    data = [args[1], msg.author.id, args[0], note, msg.author.username]
  ) {
    return new Promise(function (resolve, reject) {
      client.db.run(query, data, function (err) {
        console.log(data);
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  };

  if ((await queryInsert()) > 0)
    return msg.channel.send(
      `Now monitoring package from ${args[0]} with Tracking # ${args[1]} for <@${msg.author.id}>`
    );
};

exports.help = {
  name: 'watch',
  aliases: ['w'],
  category: 'Primary',
  description: 'Receieve Package Updates',
  usage: '.watch',
};
