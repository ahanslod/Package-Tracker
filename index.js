require('dotenv').config();
const path = require('path');
const dbPath = path.resolve(__dirname, './db/bot.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);
const Discord = require('discord.js');
const client = new Discord.Client();
const EasyPost = require('@easypost/api');
const api = new EasyPost(process.env.EASYPOST_TOKEN);
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const moment = require('moment');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const dbSchemas = require('./utils/dbSchemas.json');
const hookHandler = require('./utils/hookHandler');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.moment = moment;
client.dbSchemas = dbSchemas;
client.db = db;
client.EasyPost = api;
client.prefix = process.env.PREFIX;

const init = async () => {
  // Loading the commands now
  const cmdFiles = await readdir('./commands/');
  console.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach((f) => {
    try {
      if (!f.endsWith('.js')) return;
      const props = require(`./commands/${f}`);
      const command = f.split('.')[0];
      console.log(`Attempting to load command ${command}`);
      client.commands.set(props.help.name, props);
      props.help.aliases.forEach((alias) => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      console.log(`Unable to load command ${f}: ${e.stack}`);
    }
  });
  // Loading the events now
  const eventFile = await readdir('./events/');
  console.log(`Loading a total of ${eventFile.length} events.`);
  eventFile.forEach((f) => {
    if (!f.endsWith('.js')) return;
    const eventName = f.split('.')[0];
    const event = require(`./events/${f}`);
    console.log(`Attempting to load command ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${f}`)];
  });

  client.login(process.env.BOT_TOKEN).catch((err) => {
    console.error(err);
  });
};

init();

// Use Json and complex algo for deep parsing to deal with nested objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook endpoint
app.post('/hook', (req, res) => {
  if (req.body.description !== 'tracker.created')
    hookHandler.trackerUpdate(client, req.body.result);
  res.sendStatus(200);
});

// Loading express server
app.listen(process.env.PORT, () => {
  (async function () {
    const url = await ngrok.connect(process.env.PORT);
    const webhook = new api.Webhook({ url: url + '/hook' });

    webhook.save().then(console.log);

    console.log(
      `Publically accessible tunnel to localhost:${process.env.PORT} is available on ${url}`
    );
  })();
});
