import dbConnect from "@/lib/db";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials:{
                email: {label: "Email", type: "text", placeholder: "example@gmail.com"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password")
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token.__id?.toString()
                session.user.username = token.username
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.role = user.role
            }
            return token
        }
    }
}