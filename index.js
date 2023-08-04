const { Client, Intents, MessageEmbed } = require('discord.js');
const request = require('request');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const TOKEN = 'Bot_Token'; // put here your bot token
const prefix = '!'; // you can change bot prefix

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Bot is Ready`);
  console.log(`Code by 约 - Wick`);
  client.user.setActivity(`type ${prefix}help`);
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'gif') {
    if (!args.length) {
      return message.channel.send('You need to choose which gif you asking for');
    }

    const searchTerm = encodeURIComponent(args.join(' '));
    const apiKey = 'S5XDZBHFU4JM'; // Don't touch this
    const apiUrl = `https://api.tenor.com/v1/search?q=${searchTerm}&key=${apiKey}`; // Don't touch this
    const searchQuery = args.join(' ');

    request.get(apiUrl, { json: true }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error('Error fetching GIFs:', error || response.statusMessage);
        return message.channel.send('Error GIF not found!');
      }

      const gifResults = body.results;
      if (!gifResults || gifResults.length === 0) {
        return message.channel.send('Error GIF not found!');
      }

      const maxIndex = gifResults.length - 1;
      const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
      const gifUrl = gifResults[randomIndex].media[0].gif.url;

      const embed = new MessageEmbed()
        .setColor('#FFB200')
        .setTitle(`GIF of ${searchQuery}`)
        .setImage(gifUrl)
        .setFooter(`Requested by ${message.author.username}`);

      message.channel.send({ embeds: [embed] })
        .then(sentEmbed => {
          sentEmbed.react('👍'); // You can change reactions if you want
          sentEmbed.react('👎');
        })
        .catch(error => {
          console.error('Error adding reactions:', error);
        });
    });
  }
});

client.login(TOKEN);
