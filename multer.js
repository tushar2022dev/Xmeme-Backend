// middleware to accept data in form of file

const multer = require('multer')
const path = require('path')


const upload = multer({
       
    storage:multer.diskStorage({         // location to store our files
      destination:function(req,file,cb){
          cb(null,"uploads");
      },
      filename:function(req,file,cb)   // setting up filename: unique for each file
      {
          let tempName = file.filename+"-"+Date.now()+".jpg";
          cb(null,tempName);
          
          process.env.UNIQUE_FNAME  = "http://localhost:5000/uploads/"+tempName;  // setting name in env variable and storing in database
      }
    })

}).single("meme_img");

module.exports = upload;
