import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const fetchUser = await prisma.user.findMany({
      where: { memberships: { some: { userId } } },
    });

    return NextResponse.json(fetchUser);
  } catch (e) {
    console.error("Failed to Fetch data", e);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}











export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, email, image } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const createUser = await prisma.user.create({
      data: { id: userId, name, email, image },
    });

    return NextResponse.json(createUser);
  } catch (e) {
    console.error("Failed to Create data", e);
    return new NextResponse("Failed to Create users", { status: 500 });
  }
}
