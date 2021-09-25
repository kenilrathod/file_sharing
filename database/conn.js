const mongoose = require('mongoose');
require("dotenv").config()

mongoose.connect(process.env.MONGODB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
const connection = mongoose.connection;

connection.once('open',()=>{
  console.log("Connection Started")
})

module.exports = connection;