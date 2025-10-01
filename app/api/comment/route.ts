import { auth } from "@clerk/nextjs/server";
import { errorToJSON } from "next/dist/server/render";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { content, leadId, taskId } = await req.json();
  if (!leadId || !taskId) {
    return new NextResponse("leadId and taskid not found", { status: 404 });
  }
  try {
  } catch (err) {
    console.error("Failed to create comments", err);
    return new NextResponse("Failed to create comment", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to fetch comments", err);
    return new NextResponse("Failed to fetch comment", { status: 500 });
  }
}

