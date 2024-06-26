import connect from "@/app/lib/db";
import Blog from "@/app/lib/models/blog";
import Category from "@/app/lib/models/category";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"


export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId");
        const searchKeywords = searchParams.get("keyword");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 })
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 })
        }

        await connect()

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }))
        }

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found or doest belog to the user" }, { status: 404 })
            )
        }

        const filter = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        }

        if (searchKeywords) {
            filter.$or = [
                {
                    title: { $regex: searchKeywords, $options: 'i' }
                },
                {
                    description: { $regex: searchKeywords, $options: 'i' }
                }
            ]
        }


        const blogs = await Blog.find(filter)

        return new NextResponse(JSON.stringify({ blogs }), {
            status: 200
        })

    } catch (error) {
        return new NextResponse("Error in fetching blogs" + error.message, {
            status: 500
        })
    }
}


export const POST = async (request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        const body = await request.json();
        const { title, description } = body;

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

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        })

        await newBlog.save()

        return new NextResponse(
            JSON.stringify({ message: "Blog is created" }), { status: 200 }
        )

    } catch (error) {
        return new NextResponse("Errror in fetching blogs" + error.message, {
            status: 500
        })
    }
}