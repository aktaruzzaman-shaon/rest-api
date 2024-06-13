import connect from "@/app/lib/db";
import Category from "@/app/lib/models/category";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }, { status: 400 }))
        }

        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }, { status: 400 }))
        }
        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        })

        return new NextResponse(JSON.stringify(categories), {
            status: 200
        })

    } catch (error) {
        return new NextResponse("Errro in categorties" + error.message, {
            status: 500
        })
    }
}


export const POST = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const { title } = await request.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }, { status: 400 }))
        }

        await connect();
        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }, { status: 400 }))
        }

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId)
        })

        await newCategory.save()

        return new NextResponse(JSON.stringify({ message: "Category is created", category: newCategory }))

    } catch (error) {
        return new NextResponse("Error in creating categories" + error.message, {
            status: 500
        })
    }
}


