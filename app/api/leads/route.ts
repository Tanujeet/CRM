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
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const assignedTo = searchParams.get("assignedTo");
    const teamId = searchParams.get("teamId");

    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);
    if (teamId && !teamIds.includes(teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }
    const where: any = {
      teamId: teamId ? teamId : { in: teamIds },
      isDeleted: false,
    };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (assignedTo) where.assignedTo = assignedTo;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        customer: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
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
  const { status, value, teamId, customerId, assignedTo } = await req.json();
  try {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer || customer.isDeleted || customer.teamId !== teamId) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    if (assignedTo) {
      const assignedMembership = await prisma.membership.findFirst({
        where: { userId: assignedTo, teamId },
      });
      if (!assignedMembership) {
        return new NextResponse("Assigned user not part of this team", {
          status: 403,
        });
      }
    }

    const newLead = await prisma.lead.create({
      data: { status: status || "NEW", value, teamId, customerId, assignedTo },
    });
    return NextResponse.json(newLead);
  } catch (err) {
    console.error("Failed to update leads", err);
    return new NextResponse("Failed to update leads", { status: 500 });
  }
}
