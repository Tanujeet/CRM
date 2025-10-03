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
  const { content } = await req.json();
  if (!content || content.trim().length === 0) {
    return new NextResponse("Content cannot be empty", { status: 400 });
  }
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }
    if (comment.userId !== userId) {
      return new NextResponse("Forbidden: Not your comment", { status: 403 });
    }

    const updateCommnet = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updateCommnet);
  } catch (err) {
    console.error("Failed to update comment", err);
    return new NextResponse("Failed to update comment", { status: 500 });
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
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Forbidden: Not your comment", { status: 403 });
    }

    await prisma.comment.delete({ where: { id } });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Failed to delete comment", err);
    return new NextResponse("Failed to delete comment", { status: 500 });
  }
}