import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request) => {
    try {
        console.log("Connecting to database...");
        await connect();

        console.log("Fetching posts...");
        const posts = await Post.find();

        console.log("Posts found:", posts.length);
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (err) {2
        console.error("Database Error:", err);
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    }
};