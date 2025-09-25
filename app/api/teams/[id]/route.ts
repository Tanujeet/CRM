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
    const memberships = await prisma.membership.findFirst({
      where: { userId, teamId: id },
    });

    if (!memberships) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const getTeam = await prisma.team.findUnique({
      where: { id: id },
      include: {
        owner: true,
        memberships: { include: { user: true } },
      },
    });
    return NextResponse.json(getTeam);
  } catch (e) {
    console.error("Failed to fetch single Team", e);
    return new NextResponse("Failed to fetch single Team", { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;
  try {
    const team = await prisma.team.findUnique({
      where: { id },
    });
    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    const membership = await prisma.membership.findFirst({
      where: { userId, role: "ADMIN" },
    });
    if (membership?.role !== "ADMIN" && team.ownerId !== userId) {
      return 403;
    }
  } catch (e) {
    console.error("Failed to update Team", e);
    return new NextResponse("Failed to update Team", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 403 });
  }

  try {
  } catch (e) {
    console.error("Failed to delete Team", e);
    return new NextResponse("Failed to delete Team", { status: 500 });
  }
}