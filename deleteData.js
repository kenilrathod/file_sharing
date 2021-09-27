const database = require("./database/conn");
const File = require("./modal/modal");
const fs = require("fs");

const deleteExpireddata = async() => {

    const expiredate = new Date(Date.now()-24*60*60*1000)
    const expire_File = await File.find({createdAt :{$lt:expiredate}})
    if(expire_File.length){
        for(const file of expire_File)
        try {
            fs.unlinkSync(file.filepath)
            await file.remove()  
        } catch (error) {
            console.log("Error while deleting file ",error)
        }
    }
}

deleteExpireddata().then(process.exit);
