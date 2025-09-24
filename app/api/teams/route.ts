import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const getTeams = await prisma.team.findMany({
      where: {
        memberships: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        memberships: true,
      },
    });
    return NextResponse.json(getTeams);
  } catch (e) {
    console.error("Failed to get teams", e);
    return new NextResponse("Failed to get teams", { status: 500 });
  }
}



export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { name, plan } = await req.json();

  if (!name) {
    return new NextResponse("Name doesnt exist", { status: 400 });
  }
  try {
    const newTeam = await prisma.team.create({
      data: {
        name,
        ownerId: userId,
        plan: plan || "FREE",
        memberships: { create: { userId: userId, role: "ADMIN" } },
      },
      include: { memberships: true },
    });

    return NextResponse.json(newTeam);
  } catch (e) {
    console.error("Failed to create Teams", e);
    return new NextResponse("Failed to create teams", { status: 500 });
  }
}