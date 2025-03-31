import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.MONGO_URI as string;
const dbName: string = process.env.DB_NAME as string;

let dbConnection: Db | null = null;

export async function mongoDb() {
  try {
    if (dbConnection) {
      return dbConnection;
    }

    const client = await MongoClient.connect(uri);
    dbConnection = client.db(dbName);

    console.log("Connected to the database");
    return dbConnection;
  } catch (error) {
    console.error("Couldn't connect to db", error);
    throw new Error("Database connection failed");
  }
}

