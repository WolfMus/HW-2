import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { Blog } from "../blogs/types/blogs";
import { PostViewModel } from "../posts/types/posts";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<PostViewModel>;

export async function runDb(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("✅ Connected to the database");
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`)
    }
}