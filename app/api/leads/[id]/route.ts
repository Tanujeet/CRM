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
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead || lead.isDeleted) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    if (!teamIds.includes(lead.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }

    return NextResponse.json(lead);
  } catch (err) {
    console.error("Failed to get one lead", err);
    return new NextResponse("Failed to get one lead", { status: 500 });
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
  const { status, value, assignedTo } = await req.json();
  try {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead || lead.isDeleted) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    if (!teamIds.includes(lead.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }

    const updateLead = await prisma.lead.update({
      where: { id },
      data: { status, value, assignedTo },
    });
    return NextResponse.json(updateLead);
  } catch (err) {
    console.error("Failed to update lead", err);
    return new NextResponse("Failed to update lead", { status: 500 });
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
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.isDeleted) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    if (!teamIds.includes(lead.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }
    const deleteLeads = await prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });
    return NextResponse.json(deleteLeads);
  } catch (err) {
    console.error("Failed to delete lead", err);
    return new NextResponse("Failed to delete lead", { status: 500 });
  }
}
