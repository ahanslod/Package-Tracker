exports.run = async (client, msg, args) => {
  msg.channel.send(`Pong! API Latency is ${Math.round(client.ws.ping)} ms`);
};

exports.help = {
  name: 'ping',
  aliases: ['p'],
  category: 'Miscelaneous',
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: 'ping',
};
