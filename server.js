const express = require('express');
const config = require('config');

const app = express();

// body parser
app.use(express.json());

// routes
const userRouter = require('./routes/userRouter');
app.use('/', userRouter);


const PORT = config.get('app.port') || 6068;
app.listen(
    PORT, 
    () => console.log(`Application is running on port ${PORT}`)
    );