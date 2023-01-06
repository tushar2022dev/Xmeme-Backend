 // this is our entry point
const PORT = 5000 
const express = require('express')
const jwt = require('jsonwebtoken')
const database = require('./database')
const userCollection = require('./UserCollection')
const middle = require('./multer')
const dotenv = require('dotenv')
const e = require('express')


dotenv.config()
const app = express()
app.use(express.json())
app.listen(PORT)
app.use('/uploads',verifyToken,express.static('uploads'))

console.log('Server started on PORT:'+PORT)


//                      --------      GET API's   ---------

app.get('/profile',verifyToken,(req,res)=>{  
    
    const user = req.user
    res.send({
        "status":1,
        user})
})



app.get('/feed',async (req,res)=>{   //    returns memes to show in user feed 
    
    console.log('GET request recieved!')
    const conn =await database()
    conn.find().sort({"dateTime":-1}).limit(100).toArray().then((data)=>{res.send(data)})

})



function verifyToken(req,res,next){             // middleware for jwt token verification 
    const token = req.headers['authorization']
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
      else{
  
       const userData = authData.user
       req.user = userData
       next()
      }
  })
 
  }



//      _______________________________------------------ POST API's---------------________________________________



app.post('/signup',async (req,res)=>{   //   we get a username(unique) ,real name , password  and we store user credentials 
    const conn = await userCollection()

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
    let userArr = await conn.find({"username":req.body.username, "password":req.body.password}).toArray()
    if( userArr.length == 0){                    // incorrect username or password
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

    jwt.sign({user},process.env.JWT_SECRET,{expiresIn: '300s'},(err,token)=>{   //  the user is valid ,hence we return the jwt token

        console.log(token+" Returned !!")
         res.json({
            "status":1,
            token
         })
    })}

})



app.post('/upload',middle,verifyToken,async(req,res)=>{  // insert meme details in the mongodb database 
   
   console.log('POST request recieved!')
   const conn = await database()
   let obj = {
   "posted_by": req.user.username,
   "img_link" : process.env.UNIQUE_FNAME,
   "dateTime" : Date.now(),
   }
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
