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
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        lead: true,
        task: true,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }
    let teamId = null;
    if (file.lead) teamId = file.lead.teamId;
    if (file.task) teamId = file.task.teamId;

    if (teamId) {
      const membership = await prisma.membership.findFirst({
        where: { userId, teamId },
      });

      if (!membership) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    return NextResponse.json(file);
  } catch (err) {
    console.error("Failed to fetch one file", err);
    return new NextResponse("failed to fetch one file", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
  } catch (err) {
    console.error("Failed to update file", err);
    return new NextResponse("failed to update file", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
  } catch (err) {
    console.error("Failed to update file", err);
    return new NextResponse("failed to update file", { status: 500 });
  }
}
