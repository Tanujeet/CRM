import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorozed", { status: 403 });
  }
    const { url, leadId, taskId } = await req.json();
    if (!url) {
      return new NextResponse("URL is required", { status: 404 });
    }

    if (!leadId && taskId) {
      return new NextResponse("Provide either leadId or taskId, not both", {
        status: 404,
      });
    }

    try {
      if (leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
          return new NextResponse("Lead not found", { status: 404 });
        }
        const membership = await prisma.membership.findFirst({
          where: { userId, teamId: lead.teamId },
        });
        if (!membership) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      }

      if (taskId) {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
          return new NextResponse("Task not found", { status: 404 });
        }
        const membership = await prisma.membership.findFirst({
          where: { userId, teamId: task.teamId },
        });
        if (!membership) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      }

      const newFile = await prisma.file.create({
        data: {
          url,
          uploadedBy: userId,
          leadId: leadId || null,
          taskId: taskId || null,
        },
      });

      return NextResponse.json(newFile);
    } catch (err) {
      console.error("Failed to create file", err);
      return new NextResponse("Failed to create file", { status: 500 });
    }
}


export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");
  const taskId = searchParams.get("taskId");

  // Validation
  if ((leadId && taskId) || (!leadId && !taskId)) {
    return new NextResponse("Provide either leadId or taskId", { status: 400 });
  }

  try {
    // --- Lead check ---
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) {
        return new NextResponse("Lead not found", { status: 404 });
      }

      const membership = await prisma.membership.findFirst({
        where: { userId, teamId: lead.teamId },
      });
      if (!membership) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      const files = await prisma.file.findMany({ where: { leadId } });
      return NextResponse.json(files);
    }

    // --- Task check ---
    if (taskId) {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task) {
        return new NextResponse("Task not found", { status: 404 });
      }

      const membership = await prisma.membership.findFirst({
        where: { userId, teamId: task.teamId },
      });
      if (!membership) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      const files = await prisma.file.findMany({ where: { taskId } });
      return NextResponse.json(files);
    }
  } catch (err) {
    console.error("Failed to fetch files", err);
    return new NextResponse("Failed to fetch files", { status: 500 });
  }
}