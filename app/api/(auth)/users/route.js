import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect()
        const users = await User.find();

        return new NextResponse(JSON.stringify(users), { status: 200 })
    } catch (err) {
        return new NextResponse("Error in fetching users" + err.messsage, { status: 500 })
    }
}

export const POST = async (request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body)
        await newUser.save();
        return new NextResponse(JSON.stringify({ mesasge: "user is created", user: newUser }, { staus: 200 }))

    } catch (err) {
        return new NextResponse("Error in crating user" + err.messsage, { status: 500 })
    } fsf
}

export const PATCH = async (request) => {
    try {
        const body = await request.json();
        const { userid, newUsername } = body;
        await connect();
        if (!userid || !newUsername) {
            return new NextResponse(
                JSON.stringify({ messsage: "ID or username not found" }, { status: 400 })
            )
        }
        if (!Types.ObjectId.isValid(userid)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user id" }, { status: 400 })
            )
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userid) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse({ message: "Update user not found" })
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated" }, { user: updatedUser })
        )

    } catch (error) {
        return new NextResponse("Error in updating user" + error.message, { status: 500 })
    }
}

export const DELETE = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "ID not found" }, { status: 400 })
            )
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Usre id" }, { staus: 400 }))
        }

        await connect();
        const deleteUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )

        if (!deleteUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" })
            )
        }

        return new NextResponse({ message: "User deleted" })

    } catch (error) {
        return new NextResponse("Error in deleting user" + error.message, {
            status: 500
        })
    }
}