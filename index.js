const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define MongoDB URL and database name
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'hwmDatabase';

// Create a new MongoClient
const client = new MongoClient(url);

// Create HTTP server
const server = http.createServer(app);

// Connect socket.io to the HTTP server
const io = socketIO(server);

// Connect to MongoDB
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');

        app.post('/register', async (request, response, next) => {
            console.log('test213');
            const post_data = request.body;

            const name = post_data.name;
            const email = post_data.email;
            const password = post_data.password;

            const insertJson = {
                'email': email,
                'password': password,
                'name': name
            };

            const db = client.db('hwmDatabase');

            const count = await db.collection('user').countDocuments({ 'email': email });
            if (count !== 0) {
                response.json('Email already exists');
                console.log('Email already exists');
            } else {
                await db.collection('user').insertOne(insertJson);
                response.json('Registration successful');
                console.log('Registration successful');
            }
        });

        app.post('/login', async (request, response, next) => {

            const post_data = request.body;
            const email = post_data.email;
            const userPassword = post_data.password;

            const db = client.db('hwmDatabase');

            const count = await db.collection('user').countDocuments({ 'email': email });
            if (count === 0) {
                response.json('Email not exists');
                console.log('Email not exists');
            } else {
                const user = await db.collection('user').findOne({ 'email': email });
                const password = user.password;

                if (userPassword === password) {
                    response.json('Login success');
                    console.log('Login success');
                } else {
                    response.json('Wrong password');
                    console.log('Wrong password');
                }
            }
        });

        console.log("Connection Open!");

        // Socket.io connection logic
        io.on('connection', (socket) => {
            console.log('New client connected');

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        // Attach the HTTP server to port 3000
        server.listen(3000, () => {
            console.log("APP IS LISTENING ON PORT 3000");
        });
    })
    .catch(err => {
        console.log("Error connecting to MongoDB");
        console.error(err);
    });
