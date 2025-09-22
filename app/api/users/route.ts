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
  } catch (e) {
    console.error("Failed to  Post data", e);
    return new NextResponse("Failed to Post users", { status: 500 });
  }
}
