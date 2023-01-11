const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const url = `mongodb+srv://megamind:${process.env.MONGO_PASS}@cluster0.mfx7n5a.mongodb.net/?retryWrites=true&w=majority`
const dbName = 'XMeme'
const collectionName = 'Messages'


const client = new MongoClient(url)

async function dbConnect(){
  const conn = await client.connect();
  const db = await conn.db(dbName)
  return db.collection(collectionName);
   
}

module.exports = dbConnect;