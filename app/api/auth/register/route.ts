import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();

    const existingEmailUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingEmailUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const existingUsernameUser = await prisma.user.findUnique({
      where: { name: username },
    });
    if (existingUsernameUser) {
      return NextResponse.json({ message: "Username already in use" }, { status: 400 });
    }

    const hashPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name: username,
        password: hashPassword,
        email: email,
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}