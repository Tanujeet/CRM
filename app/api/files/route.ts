import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorozed", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to create file", err);
    return new NextResponse("Failed to create file", { status: 500 });
  }
}
