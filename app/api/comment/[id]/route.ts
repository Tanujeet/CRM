import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("GET_COMMENT_BY_ID_ERROR", error);
    return new NextResponse("Failed to fetch one comment", { status: 500 });
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
  try {
  } catch (err) {
    console.error("Failed to fetch one comment", err);
    return new NextResponse("Failed to fetch one comment", { status: 500 });
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
  } catch (err) {
    console.error("Failed to fetch one comment", err);
    return new NextResponse("Failed to fetch one comment", { status: 500 });
  }
}
