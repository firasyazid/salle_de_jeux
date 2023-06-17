const express = require('express');
const app = express(); 
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const serverless = require('serverless-http');
require('dotenv/config');
const api = process.env.API_URL;

 
const usersRouter = require('./routers/user.js');
const sessionRouter = require('./routers/session');

  
 
app.use(cors()); 
app.options('*',cors ());


app.use(express.json()); 
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routes
app.use('/.netlify/functions/api/users', usersRouter);
app.use('/.netlify/functions/api/session', sessionRouter);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'salle_de_jeuxx-database'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})
const port = process.env.port
app.listen(port, ()=>{
     console.log('server is running http://localhost:3000');
})


module.exports = app;
module.exports.handler = serverless(app);