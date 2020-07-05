module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.db.exec(client.dbSchemas['create'], (err) => {
    if (err) return console.error(err.message);
  });

  console.log(`Connected to ${client.user.username}'s SQLite3 database.`);

  client.user
    .setPresence({
      activity: { name: '.cmd for commands', type: 'WATCHING' },
      status: 'available',
    })
    .then(console.log)
    .catch(console.error);
};
