   // this file is used to connect node to our mongodb database

const {MongoClient} = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'XMeme'
const collectionName = 'MemeInfo'

const client = new MongoClient(url)

async function dbConnect(){

    const conn = await client.connect()
    let db = await conn.db(dbName)
    return db.collection(collectionName)   // connection to our collection is returned by function

}

module.exports = dbConnect;



