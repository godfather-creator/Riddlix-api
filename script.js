import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';


import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfileGet from "./controllers/profile.js";
import handleImage from "./controllers/image.js";
import handleClarifai from "./controllers/clarifai.js";

const db = knex({ 
  client: 'pg', 
  connection: process.env.DATABASE_URL,
  ssl:{rejectUnauthorized:false}
});

const app=express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => { res.send('success'); });

app.post('/signin',     (req, res) => { handleSignin(req, res, db, bcrypt) });
app.post('/register', handleRegister(db, bcrypt)); 
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) });
app.post('/image',      (req, res) => { handleImage(req, res, db) });
app.post('/clarifai',   (req, res) => { handleClarifai(req, res) });




app.listen(process.env.PORT || 4000,()=>{ 
    console.log(`app is running on port ${process.env.PORT}`);
});
