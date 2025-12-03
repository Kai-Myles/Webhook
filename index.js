import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post('/github', async (req, res) => {
  const payload = req.body;
  const commits = payload.commits || [];

  if (commits.length === 0) return res.send("No commits");

  const messages = commits.map(c =>
    `**${c.message.split("\n")[0]}**\n${c.url}`
  ).join("\n\n");

  await fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: `⚙️ New commit(s) in ${payload.repository.name}:\n\n${messages}` })
  });

  res.send("OK");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
