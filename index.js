 // this is our entry point
const PORT = 5000 
const express = require('express')
const jwt = require('jsonwebtoken')
const database = require('./database')
const userCollection = require('./UserCollection')
const middle = require('./multer')
const dotenv = require('dotenv')
const e = require('express')
const bodyParser = require('body-parser')
const { urlencoded, json } = require('express')
const cloudinary = require('./cloudinary')

dotenv.config()
const app = express()
app.use(express.json())
const hostname = '0.0.0.0'
app.listen(PORT,hostname)
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

console.log('Server started on PORT:'+PORT)




app.use( (req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
});


//                      --------      GET API's   ---------

app.get('/profile',verifyToken,(req,res)=>{  // sends back user details
    
    const user = req.user
    res.send({
        "status":1,
        user})
})




app.get('/feed',verifyToken,async (req,res)=>{   //    returns memes to show in user feed 
    
    console.log('GET request recieved!')
    const conn =await database()
    conn.find().sort({"dateTime":-1}).limit(100).toArray().then((data)=>{res.send({"status":1, data})})

})


function verifyToken(req,res,next){             // middleware for jwt token verification 
    if(!req.headers){
        res.send({
           "status":0,
           "message":"Token not found!"
        })
     }
    const token = req.headers['authorization']
    console.log(token)
    if(!token){
       res.send({
          "status":0,
          "message":"Token not found!"
       })
    }
    
    jwt.verify(token,process.env.JWT_SECRET,(err,authData)=>{
      if(err){
  
       res.send({
           "status":0,
           "message":"Invalid Token!"
       })
      }
      else{            // if jwt valid then attach user data with request
  
       const userData = authData.user
       req.user = userData
       next()
      }
  })
 
  }



//      _______________________________------------------ POST API's---------------________________________________



app.post('/signup',async (req,res)=>{   //   we get a username(unique) ,real name , password  and we store user credentials 
    const conn = await userCollection()
    console.log("signup request recieved!")
    console.log(req.body.name)
    console.log(req.body)
    if((await conn.find({"username":req.body.username}).toArray()).length){
        const negativeResponse = {
            "status":0,
             "message":"Username already taken!"
        }
         res.send(negativeResponse)
    }

    else{
       let newUser = {
         "username":req.body.username,
          "name":req.body.name,
          "password":req.body.password,
          "email":req.body.email,
          "meme_count":0            
       }
       await conn.insertOne(newUser)
       const positiveResponse = {
        "status":1,
         "message":"User Registered sucessfully!"
       }
       res.send(positiveResponse)
    }

})




app.post('/login',async (req,res)=>{

    const conn =await userCollection()
    console.log(req.body.username)
    console.log(await conn.find().toArray())
    let userArr = await conn.find({"username":req.body.username, "password":req.body.password}).toArray()
    if( userArr.length == 0){                    // incorrect username or password
        console.log('here')
        const negativeResponse={
            "status":0,
            "message":'Please check username and Password!'
        }
        res.send(negativeResponse)
    }

    else{
    
    let user = userArr[0]
    delete user.password
    delete user._id

    jwt.sign({user},process.env.JWT_SECRET,{expiresIn: '3000s'},(err,token)=>{   //  the user is valid ,hence we return the jwt token

        console.log(token+" Returned !!")
         res.json({
            "status":1,
            "jwt":JSON.stringify(token)
         })
    })}

})








app.post('/upload',verifyToken,middle,async(req,res)=>{  // insert meme details in the mongodb database 
   

   console.log('POST request recieved!')
   const conn = await database()

   let obj = {
   "username": req.user.username,
   "caption": req.body.caption,
   "dateTime" : Date.now(),
   }

   console.log(req.file)
  await cloudinary.v2.uploader.upload(req.file.path,
  { folder:"xmeme_meme" }, 
  function(error, result) {obj.image = result.secure_url });
     

   console.log(obj)
   const result = await conn.insertOne(obj)
   if(result.acknowledged){
    res.send({
        "status":1,
        "message":"meme uploaded sucessfully!"
    })
   }
   else{
    res.send({
        "status":0,
        "message":"Some error occured while uploading!"
    })
   }
   


})
