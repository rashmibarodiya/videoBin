import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/connect";
import User from "@/models/user"
import { error } from "console";


export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        await connect()

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return NextResponse.json({
                error: "User is already registered"
            }, { status: 400 })
        }

        await User.create({
            email, password
        })
        return NextResponse.json({
            message: "User registered successfully"
        },
            { status: 200 })
    } catch (error) {
        console.error("Registration error : ", error)
        return NextResponse.json({ error: "Failed to register" }, { status: 200 })
    }
}