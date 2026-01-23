import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request, { params }) => {
    // Await params here
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    console.log("Post ID:", id);

    try {
        await connect();

        const post = await Post.findById(id);

        console.log("Found post:", post);

        // Check if post exists
        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (err) {
      console.error("Database error:", err);
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
  const resolvedParams = await params;
    const { id } = resolvedParams;

  try {
    await connect();

    await Post.findByIdAndDelete(id);

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};