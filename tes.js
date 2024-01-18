const express = require("express");
const app = express();
const port = 3000;

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client, LegacySessionAuth } = require("whatsapp-web.js");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  authStrategy: new LegacySessionAuth({
    session: sessionData,
  }),
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  //   console.log(qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/api", (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan = req.query.pesan;

  tujuan = tujuan.substring(1);
  tujuan = `62${tujuan}@c.us`;

  client.searchMessages(tujuan, pesan);
  console.log(tujuan);

  //   client.sendMessage(tujuan, pesan);
  res.json({ status: false });
  //   console.log(tujuan);
  console.log(pesan);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// client.on("disconnected", (reason) => {
//   console.log("disconnect whatsapp-bot", reason);
// });

// client.initialize();
