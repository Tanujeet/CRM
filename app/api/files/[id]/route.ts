import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
  } catch (err) {
    console.error("Failed to fetch one file", err);
    return new NextResponse("failed to fetch one file", { status: 500 });
  }
}


export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
  } catch (err) {
    console.error("Failed to update file", err);
    return new NextResponse("failed to update file", { status: 500 });
  }
}
