import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { content, leadId, taskId } = await req.json();
  if (!content) {
    return new NextResponse("Content is required", { status: 400 });
  }

  if (!leadId && !taskId) {
    return new NextResponse("leadId and taskid not found", { status: 404 });
  }
  try {
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return new NextResponse("Lead not found", { status: 404 });
    }

    if (taskId) {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task) return new NextResponse("Task not found", { status: 404 });
    }

    const createComment = await prisma.comment.create({
      data: {
        content,
        userId,
        leadId: leadId || null,
        taskId: taskId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(createComment);
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
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const taskId = searchParams.get("taskId");

    const comments = await prisma.comment.findMany({
      where: {
        leadId: leadId || undefined,
        taskId: taskId || undefined,
      },
      include: {
        user: true,
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