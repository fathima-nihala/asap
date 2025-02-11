const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const router = require('./router/router');

require('dotenv').config();

const dotenvConfig = dotenv.config({
    path: path.resolve(__dirname, './config', '.env')
})

if (dotenvConfig.error) {
    console.log('Error Loading .env file', dotenvConfig.error);
}


app.use(express.json());
app.use(cookieParser());
app.use(cors());


mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
    console.log("Database is connected successfully 😎 ");
    app.listen(process.env.PORT, () => {
        console.log(`Server connected at 🖥️ ${process.env.PORT}`);
    });
}).catch(error => {
    console.error('Database connection error:', error);
    process.exit(1);  
});

app.use('/api', router)

module.exports = app;