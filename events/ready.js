module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.db.exec(client.dbSchemas['create'], (err) => {
    if (err) return console.error(err.message);
  });

  console.log(`Connected to ${client.user.username}'s SQLite3 database.`);
};
