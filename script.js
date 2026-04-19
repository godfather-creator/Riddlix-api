const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const axios = require("axios");

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ INIT DB
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'Vipransh@4',
    database: 'riddlix',
  },
});



// ✅ ROUTES
app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(db, bcrypt)(req, res);
});
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const lastMessage = messages[messages.length - 1].content;

    const response = await axios({
      method: "POST",
      url: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: `You are a helpful CSE tutor. Answer clearly:\n${lastMessage}`,
      },
    });

    console.log("HF RAW:", response.data);

    const reply =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      "I couldn't understand that.";

    res.json({ reply });

  } catch (err) {
    console.error("FULL HF ERROR:", err.response?.data || err.message);

    res.json({
      reply: "Sorry to say but I think server is down I am really sorry my friend for this inconvenience...",
    });
  }
});

app.listen(4000, () => {
  console.log(`app is running on port 4000`);
});