const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const jwt=require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());
const config=require('./config');
const uri=config.uri;
const port=config.port;
const passphrase=config.passphrase;
console.log(uri);
mongoose.connect(uri, {useNewUrlParser : true,useCreateIndex : true });
const connection = mongoose.connection;
connection.once('open',() => {
    console.log("MongoDB database connection established successfully");
});
app.use('/uploads', express.static('uploads'));
const usersRoute = require('./routes/users');
app.use('/users',usersRoute);
const auctionsRoute = require('./routes/auctions');
app.use('/auctions',auctionsRoute);
const categoriesRoute = require('./routes/categories');
app.use('/categories',categoriesRoute);
const bidsRoute = require('./routes/bids');
app.use('/bids',bidsRoute)
const messagesRoute = require('./routes/messages');
app.use('/messages',messagesRoute);
https.createServer({
    key: fs.readFileSync('./security/server.key'),
    cert: fs.readFileSync('./security/server.crt'),
    passphrase: passphrase
},app).listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
