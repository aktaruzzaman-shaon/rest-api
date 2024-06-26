import connect from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import Category from "@/app/lib/models/category";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request, context) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse({ message: "Invalid or missing userId" }, { status: 400 })
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryid" }, { status: 400 }))
        }

        await connect();

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }, { status: 404 }))
        }

        const category = await Category.findOne({ _id: categoryId, user: userId })

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found or doest belog to the user" }, { status: 404 })
            )
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        })

        if (!blog) {
            return new NextResponse(JSON.stringify({
                message: "Blog not found"
            }))
        }

        return new NextResponse(JSON.stringify({ blog }), { status: 200 })


    } catch (error) {
        return new NextResponse("Error in fetching data" + error.message, { status: 500 })
    }
}

export const PATCH = async (request, context) => {
    const blogId = context.params.blog;
    console.log(blogId, "blogId")

    try {
        const body = await request.json();
        const { title, description } = body;

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")


        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse({ message: "Invalid or missing userId" }, { status: 400 })
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogId" }, { status: 400 })
            )
        }


        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }, { status: 404 }))
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }, { status: 404 }))
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        )

        return new NextResponse(
            JSON.stringify({ message: "Blog updated" }, { blog: updatedBlog })
        )

    } catch (error) {
        return new NextResponse("Error in updating  blog" + error.message, { status: 500 })
    }
}

export const DELETE = async (request, context) => {
    const blogId = context.params.blog;


    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse({ message: "Invalid userId" }, { status: 400 })
        }
        console.log(userId,"userId")

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse({ message: "Invalid blogId" }, { status: 400 })
        }
        

        console.log(blogId, userId, "hwllo")

        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }, { status: 404 }))
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }, { status: 404 }))
        }

        await Blog.findByIdAndDelete(blogId)


        return new NextResponse(JSON.stringify({ message: "Blog is successfully deleted" }, { status: 200 }))


    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Couldn't delete blog" }), { status: 500 })
    }
}
