import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'finance-tracker';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  try {
    if (!client || !db) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
    }
    if (!db) {
      throw new Error('MongoDB connection failed: db is undefined');
    }
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB. Check your MONGODB_URI and MONGODB_DB.');
  }
}

export { db };
