import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const taskId = searchParams.get("taskId");

    const comments = await prisma.comment.findMany({
      where: {
        leadId: leadId || undefined,
        taskId: taskId || undefined,
      },
      include: {
        user: true, // if you want user details with each comment
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET_COMMENTS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
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

export async function DELETE(
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
