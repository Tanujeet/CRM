import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { preloadStyle } from "next/dist/server/app-render/entry-base";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to fetch activities", err);
    return new NextResponse("Failed to fetch activities", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { type, notes, leadId } = await req.json();

  try {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { teamId: true },
    });

    if (!lead) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    if (!teamIds.includes(lead.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }

    const createActivity = await prisma.activity.create({
      data: { type, notes, leadId, createdBy: userId },
    });

    return NextResponse.json(createActivity);
  } catch (err) {
    console.error("Failed to create activity", err);
    return new NextResponse("Failed to create activity", { status: 500 });
  }
}
