import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request) => {
    const url = new URL(request.url);

    const username = url.searchParams.get("username");

    try {
        console.log("Connecting to database...");
        await connect();

        console.log("Fetching posts...");
        const posts = await Post.find(username ? { username } : {});

        console.log("Posts found:", posts.length);
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (err) {
        console.error("Database Error:", err);
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    }
};

export const POST = async (request) => {
  try {
    const body = await request.json();

    // Basic validation
    const { title, desc, img, content, username } = body || {};
    if (!title || !desc || !content || !username) {
      return NextResponse.json(
        { error: "Missing required fields: title, desc, content, username" },
        { status: 400 }
      );
    }

    await connect();

    const newPost = new Post({
      title,
      desc,
      img: img || "", // allow empty string but schema requires true; better to provide default or require on client
      content,
      username,
    });

    await newPost.save();

    return NextResponse.json({ message: "Post has been created" }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: err?.message || "Database Error" }, { status: 500 });
  }
};