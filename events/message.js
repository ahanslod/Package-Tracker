module.exports = (client, msg) => {
  // Ignore all bots
  if (msg.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (msg.content.indexOf(client.prefix) !== 0) return;

  // Our standard argument/command name definition.
  let regexTest = false,
    lengthTest = false;

  // Capitalize all arguments except Last{note}, Regex and Length Filter
  const args = msg.content
    .slice(client.prefix.length)
    .trim()
    .split(/ +/g)
    .map((item, i, arr) => (i === arr.length - 1 ? item : item.toUpperCase()))
    .filter((item) =>
      item.match(/^[0-9a-zA-Z]+$/g) ? item : (regexTest = true)
    )
    .filter((item) => (item.length > 32 ? (lengthTest = true) : item));

  if (regexTest)
    return msg.channel.send('Only Alphanumeric Characters Allowed');

  if (lengthTest)
    return msg.channel.send(
      'Invalid Argument Lengths - Must be <= 32 Characters'
    );

  const command = args.shift().toLowerCase();

  if (args.length > 3) return msg.channel.send('Too many arguments');

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, msg, args);
};
