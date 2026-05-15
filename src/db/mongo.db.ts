import { SETTINGS } from "../core/settings/settings";
import mongoose from "mongoose";

export async function runDb(url: string): Promise<void> {

  try {
    await mongoose.connect(url, {dbName: SETTINGS.DB_NAME});
    console.log("✅ Connected to the database");
  } catch (e) {
    console.error(e);
    await mongoose.disconnect();
  }
}

export async function stopDb() {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    await mongoose.disconnect();
  }
  throw new Error("❌ No active client");
}




// const TOKENS_COLLECTION_NAME = "tokens";
// const BLOGS_COLLECTION_NAME = "blogs";
// const POSTS_COLLECTION_NAME = "posts";
// const USERS_COLLECTION_NAME = "users";
// const COMMENTS_COLLECTION_NAME = "comments";
// const RATELIMIT_COLLECTION_NAME = "rate-limit";
// const DEVICE_COLLECTION_NAME = "device";
// const RECOVERYCODE_COLLECTION_NAME = "recovery-code";

// export let client: MongoClient;
// export let tokensCollection: Collection<Token>;
// export let blogsCollection: Collection<Blog>;
// export let postsCollection: Collection<Post>;
// export let usersCollection: Collection<User>;
// export let commentsCollection: Collection<Comment>;
// export let rateLimitCollection: Collection<RateLimit>;
// export let securityDeviceCollection: Collection<DeviceType>;
// export let recoveryCodeCollection: Collection<RecoveryCode>;

  // client = new MongoClient(url);
  // const db: Db = client.db(SETTINGS.DB_NAME);

  // tokensCollection = db.collection<Token>(TOKENS_COLLECTION_NAME);
  // blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  // postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  // usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
  // commentsCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
  // rateLimitCollection = db.collection<RateLimit>(RATELIMIT_COLLECTION_NAME);
  // securityDeviceCollection = db.collection<DeviceType>(DEVICE_COLLECTION_NAME);
  // recoveryCodeCollection = db.collection<RecoveryCode>(RECOVERYCODE_COLLECTION_NAME);