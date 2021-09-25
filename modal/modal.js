const mongoose = require('mongoose');
const fileSchema = mongoose.Schema({
    filename:{
        type:String,
        required: true
    },
    filepath:{
        type:String,
        required: true
    },
    size:{
        type:Number,
        required: true
    },
    uuid:{
        type:String,
        required: true
    },
    senderemail:{
        type:String,
        required:false
    },
    receiveremail:{
        type:String,
        required:false
    }
},{timestamps:true})

const modal = mongoose.model("file",fileSchema);

module.exports = modal