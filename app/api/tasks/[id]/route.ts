import prisma from "@/lib/prisma";
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
    const tasks = await prisma.task.findUnique({
      where: { id },
      include: { team: true, assignee: true, lead: true },
    });
    if (!tasks) {
      return new NextResponse("Tasks not found", { status: 404 });
    }
    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    if (!teamIds.includes(tasks.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("Failed to fetch one tasks", err);
    return new NextResponse("Failed to fetch one tasks", { status: 500 });
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
const { title, description, status, dueDate, assignedTo } = await req.json();

try {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return new NextResponse("Task not found", { status: 404 });
  }

  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const teamIds = memberships.map((m) => m.teamId);
  if (!teamIds.includes(task.teamId)) {
    return new NextResponse("Forbidden: Not part of this team", {
      status: 403,
    });
  }
  if (assignedTo) {
    const assignedMembership = await prisma.membership.findFirst({
      where: { userId: assignedTo, teamId: task.teamId },
    });
    if (!assignedMembership) {
      return new NextResponse("Forbidden: Assignee not part of this team", {
        status: 403,
      });
    }
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

  const updateTask = await prisma.task.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updateTask);
} catch (err) {
  console.error("Failed to update tasks", err);
  return new NextResponse("Failed to update tasks", { status: 500 });
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
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        return new NextResponse("Task not found", { status: 404 });
      }
      const memberships = await prisma.membership.findMany({
        where: { userId },
        select: { teamId: true },
      });

      const teamIds = memberships.map((m) => m.teamId);
      if (!teamIds.includes(task.teamId)) {
        return new NextResponse("Forbidden: Not part of this team", {
          status: 403,
        });
      }

      const deleteTask = await prisma.task.update({
        where: { id },
        data: { isDeleted: true },
      });
      return NextResponse.json(deleteTask);
    } catch (err) {
      console.error("Failed to delete tasks", err);
      return new NextResponse("Failed to delete one tasks", { status: 500 });
    }
}
