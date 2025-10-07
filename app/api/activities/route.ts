import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to fetch activities", err);
    return new NextResponse("Failed to fetch activities", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to create activities", err);
    return new NextResponse("Failed to create activities", { status: 500 });
  }
}
