const mongoose = require('mongoose');

require('dotenv').config({path:"./config.env"})

const Db = process.env.URI

mongoose.connect(Db).then(() => {
    console.log('Database connection successful');
}).catch((err) => {
    console.log('Database failed to connect');
})


