import { NextResponse } from "next/server";
import {hash} from "bcrypt";

export async function POST(request: Request){
    try {
        const {username, password} = await request.json()
        console.log(username, password)

        const hashPassword = await hash(password, 10)
    } catch (error) {
        console.log(error)
    }
    return NextResponse.json({message: "success"})
}