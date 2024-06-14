import connect from "@/app/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server"


export const PATCH = async (request) => {
    const categoryId = context.params.category;
    try {
        const body = await request.json();
        const { title } = body;

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse({ message: "Invalid or missing userId" }, { status: 400 })
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId))

        await connect()

    } catch (error) {
        return new NextResponse("Error in updating category" + error.message, { status: 500 })
    }
}