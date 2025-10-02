import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;
  try {
  } catch (err) {
    console.error("Failed to fetch one comment", err);
    return new NextResponse("Failed to fetch one comment", { status: 500 });
  }
}
