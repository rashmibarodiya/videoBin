import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "./connect"
import User from "@/models/user"
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({

            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password are required")
                }
                try {
                    await connect()
                    let user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("No such user found with this email")
                    }
                    const valid = await bcrypt.compare(credentials.password, user.password);

                    if (!valid) {
                        throw new Error("Invalid password!")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    console.error("Error while logging in ", error)
                    throw error
                }
            }
        })
    ], callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        }
    }, pages: {
        signIn: "/login",
        error: "/login"
    }, session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    }, secret: process.env.AUTH_SECRET
}