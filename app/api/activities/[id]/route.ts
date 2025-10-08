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
    const fetchActivity = await prisma.activity.findUnique({ where: { id } });
    if (!fetchActivity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    if (fetchActivity.createdBy !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(fetchActivity);
  } catch (err) {
    console.error("failed to fetch a acitivity", err);
    return new NextResponse("failed to fetch a acitivity", { status: 500 });
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
  const { type, notes, leadId } = await req.json();
  try {
    const fetchActivity = await prisma.activity.findUnique({ where: { id } });
    if (!fetchActivity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    if (fetchActivity.createdBy !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updateActivity = await prisma.activity.update({
      where: { id },
      data: {
        type,
        notes,
        leadId,
      },
    });
    return NextResponse.json(updateActivity);
  } catch (err) {
    console.error("failed to update acitivity", err);
    return new NextResponse("failed to update acitivity", { status: 500 });
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
    const fetchActivity = await prisma.activity.findUnique({
      where: { id },
    });
    if (!fetchActivity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    if (fetchActivity.createdBy !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deleteActivity = await prisma.activity.delete({ where: { id } });
    return NextResponse.json(deleteActivity);
  } catch (err) {
    console.error("failed to delete acitivity", err);
    return new NextResponse("failed to delete acitivity", { status: 500 });
  }
}