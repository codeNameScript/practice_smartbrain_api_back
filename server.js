import express, { json } from 'express';
const app = express();
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { handleRegister } from './controllers/register';
import { handleSignin } from './controllers/signin';
import { handleProfile } from './controllers/profile';
import { handleImage, handleApiCall } from './controllers/image';

import nodeFetch from 'node-fetch';

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
});

app.use(json());
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(data => {
        res.send(data);
    })
})

app.post('/signin', handleSignin(db, bcrypt))

app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => handleProfile(req, res, db))

app.put('/image', (req, res) => handleImage(req, res, db))

app.post('/imageurl', (req, res) => handleApiCall(req, res, nodeFetch))

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})