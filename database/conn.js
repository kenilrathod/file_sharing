const mongoose = require('mongoose');
require("dotenv").config()

const connection = mongoose.connect(process.env.MONGODB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("Connection Succesfull!"))
  .catch(err=>console.log(err))

module.exports = connection;