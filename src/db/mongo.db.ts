import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { Blog } from "../blogs/types/blogs";
import { Post } from "../posts/types/posts";
import { User } from "../users/type/user.type";
import { Comment } from "../comments/types/comments";
import { Token } from "../auth/types/tokens.types";
import { BlackList } from "../core/types/black-list.type";

const TOKENS_COLLECTION_NAME = "tokens";
const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const USERS_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments";
const BLACKLIST_COLLECTION_NAME = "black-list";

export let client: MongoClient;
export let tokensCollection: Collection<Token>;
export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;
export let usersCollection: Collection<User>;
export let commentsCollection: Collection<Comment>;
export let blackListCollection: Collection<BlackList>;

export async function runDb(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  tokensCollection = db.collection<Token>(TOKENS_COLLECTION_NAME);
  blackListCollection = db.collection<BlackList>(BLACKLIST_COLLECTION_NAME);
  blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  usersCollection = db.collection<User>(USERS_COLLECTION_NAME);
  commentsCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error("❌ No active client");
  }
  await client.close();
}
