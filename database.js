   // this file is used to connect node to our mongodb database

const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const url =`mongodb+srv://megamind:${process.env.MONGO_PASS}@cluster0.mfx7n5a.mongodb.net/?retryWrites=true&w=majority`
const dbName = 'XMeme'
const collectionName = 'MemeInfo'


const client = new MongoClient(url)

async function dbConnect(){

    const conn = await client.connect()
    let db = await conn.db(dbName)
    return db.collection(collectionName)   // connection to our collection is returned by function

}

module.exports = dbConnect;