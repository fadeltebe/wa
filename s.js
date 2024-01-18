const express = require("express");
const app = express();
const port = 3000;
const qrcode = require("qrcode-terminal");

const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    headless: true,
  },
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "tes") {
    msg.reply("tes juga.......");
  }
});

// app.get("/api", (req, res) => {
//   let tujuan = req.query.tujuan;
//   let pesan = req.query.pesan;

//   tujuan = tujuan.substring(1);
//   tujuan = `62${tujuan}@c.us`;

//   client.sendMessage(tujuan, pesan);
//   console.log(tujuan);

//   //   client.sendMessage(tujuan, pesan);
//   res.json({ status: false });
//   //   console.log(tujuan);
//   console.log(pesan);
// });

app.get("/api", async (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan = req.query.pesan;
  // 628212121767612@c.us
  tujuan = tujuan.substring(1);
  tujuan = `62${tujuan}@c.us`;
  let cekUser = await client.isRegisteredUser(tujuan);
  if (cekUser == true) {
    client.sendMessage(tujuan, pesan);
    res.json({ status: true, pesan: pesan, msg: "pesan berhasil terkirim" });
  } else {
    res.json({
      status: false,
      pesan: pesan,
      msg: "pesan anda GAGAL terkirim",
    });
  }
});

app.listen(port, () => {
  console.log("App listen on port ", port);
});

client.initialize();
