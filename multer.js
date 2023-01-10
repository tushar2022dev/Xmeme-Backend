// middleware to accept data in form of file

const multer = require('multer')


const upload = multer({
       
    storage:multer.diskStorage({         // location to store our files
      destination:function(req,file,cb){
          cb(null,"uploads");
      },
      filename:function(req,file,cb)   // setting up filename: unique for each file
      {   console.log("file")
          let tempName = "IMG-"+Date.now()+".jpg";
          cb(null,tempName);
          
          process.env.UNIQUE_FNAME  = process.env.URL+"/uploads/"+tempName;  // setting name in env variable and storing in database
      }
    })

}).single("image");



module.exports = upload;
