module.exports = (client, msg) => {
  // Ignore all bots
  if (msg.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (msg.content.indexOf(client.prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = msg.content.slice(client.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, msg, args);
};
