import { Db, MongoClient } from "mongodb";

let cachedClientPromise: Promise<MongoClient> | null = null;

const connect = (): void => {
    if (!cachedClientPromise) {
        cachedClientPromise = MongoClient.connect(
            "mongodb://localhost:8089/stoikdb", // here for this test but should be stored elsewhere
        );
    }
};
connect();

export const databaseConnection = async (): Promise<Db> => {
    let client: MongoClient | null = null;
    client = await cachedClientPromise; // assuming for this test db always up and no issue
    return client.db();
};
