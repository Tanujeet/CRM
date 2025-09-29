import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { title, description, dueDate, teamId, leadId, assignedTo } =
    await req.json();

  if (!title || !teamId) {
    return new NextResponse("Title and TeamId is missing", { status: 404 });
  }

    try {
      if (assignedTo) {
        const assignedMembership = await prisma.membership.findFirst({
          where: { userId: assignedTo, teamId },
        });

        if (!assignedMembership) {
          return new NextResponse("Forbidden: Assignee not part of this team", {
            status: 403,
          });
        }
      }

      const memberships = await prisma.membership.findMany({
        where: { userId },
        select: { teamId: true },
      });
      const teamIds = memberships.map((m) => m.teamId);
      if (!teamIds.includes(teamId)) {
        return new NextResponse("Forbidden: Not part of this team", {
          status: 403,
        });
      }

      const createTask = await prisma.task.create({
        data: { title, description, dueDate, leadId, assignedTo, teamId },
      });
      return NextResponse.json(createTask);
    } catch (err) {
      console.error("failed to create tasks", err);
      return new NextResponse("Failed to create task", { status: 500 });
    }
}
