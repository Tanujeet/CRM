import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to fetch leads", err);
    return new NextResponse("Failed to fetch leads", { status: 500 });
  }
}
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to update leads", err);
    return new NextResponse("Failed to update leads", { status: 500 });
  }
}
