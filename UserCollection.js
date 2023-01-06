
const {MongoClient} = require('mongodb')
const dbConnect = require('./database')
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'XMeme'
const collectionName = 'UserInfo'

const client = new MongoClient(url)

async function dbConnect2(){
  const conn = await client.connect();
  const db = await conn.db(dbName)
  return db.collection(collectionName);

}

module.exports = dbConnect2;