const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer")
const hbs = require('hbs');
require("dotenv").config()
const {v4:uuid4} = require("uuid")
const conn = require("./database/conn")
const File = require("./modal/modal");
const nodemailer = require("nodemailer")
const port = 8080 || process.env.PORT

const app = express()
app.set("view engine","hbs")
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public/')))
let storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'uploads/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}_${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
})

let upload = multer({
    storage,
    limits:{ fileSize:1000000 * 100},

}).single("myfile");
hbs.registerHelper("if_eq",(a,b,opts)=>{
    if(a == b) {
        return opts.fn(this)
    }
    else{
        return opts.inverse(this);
    }
})
hbs.registerHelper("if_gt",(a,b,opts)=>{
    if(a>b)
        return opts.fn(this)
    else
        return opts.reverse(this)
})

app.get("/",(req,res)=>{
    res.render("home");
})

app.post("/file-share",(req,res)=>{
    upload(req,res,async (err) => {
        if(err){
            res.status(500).send({error:err.message})
        }
    //store into database
    const file = new File({
        filename:req.file.filename,
        uuid:uuid4(),
        filepath:req.file.path,
        size:req.file.size,

    });
    const response = await file.save();
    return res.json({file_link:`${process.env.SITE_HOST}/files/${response.uuid}`})
    })
})

app.get("/files/:uuid",async(req,res)=>{
    const result = await File.findOne({uuid:req.params.uuid})
    if(!result){
        return res.render("download",{error:"File not found it might be deleted"})
    }
    res.render("download",{
        uuid:result.uuid,
        file:result.filename,
        size:parseInt(result.size/1E3),
        downloadlink:`${process.env.SITE_HOST}/files/download/${result.uuid}`,
    })
})

app.get("/files/download/:uuid",async(req,res)=>{
    const result = await File.findOne({uuid:req.params.uuid})
    if(!result){
        return res.render("download",{error:"File can be Expired or deleted"})
    }
    const d_path = `${__dirname}/${result.filepath}`
    res.download(d_path)

})
//email 

app.post("/files/send/:uuid",async(req,res)=>{
    if(!req.body.uuid || !req.body.from || !req.body.to)
        return res.status(422).json({
            success:false,
            message:"All fields are compolsary!"
        })
    const find_file = await File.findOne({uuid:req.body.uuid})

    if(find_file.senderemail){
        return res.status(422).json({success:false,message:"can't send"})
    }
    
    if(!find_file){
       return res.status(422).json({success:false,message:"file may be deleted or expired"})
    }
    // send mail 
    const sendMail = require("./services/emailServices")
    const email_response = await sendMail({
        from:req.body.from,
        to:req.body.to,
        subject: "File Share",
        text:"Nothing to say",
        html: require("./services/emailtamplates")({
            emailFrom:req.body.from,
            downloadLink:`${process.env.SITE_HOST}/files/${find_file.uuid}`,
            size:parseInt(find_file.size/1E3)+' KB',
            expires:"24 hours"
        })
    })
    if(email_response){
    find_file.senderemail = req.body.from
    find_file.receiveremail = req.body.to
    const updated_file = await find_file.save()
    return res.json({
        success:true,
        message:"mail send successfully"  
    })}
    else{
        return res.json({
            success:false,
            message:"mail not send!try again"
        })
    }    
})

app.listen(port,(req,res)=>{
    console.log("Started")
})