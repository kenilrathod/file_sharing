const nodemailer = require("nodemailer") 
require("dotenv").config()
const sendMail = async({from, to, subject, text, html}) => {
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        },
    });

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        html
    })
    console.log(info)
    return info

}

module.exports = sendMail