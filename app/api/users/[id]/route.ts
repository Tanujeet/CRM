import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  try {
    const { name, image, email } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new NextResponse("No User Found", { status: 404 });
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { name, image, email },
    });
    return NextResponse.json(updateUser);
  } catch (e) {
    console.error("Failed to update users");
    return new NextResponse("Failed to update Users", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new NextResponse("No User Found", { status: 404 });
    }

    const deleteUser = await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(deleteUser);
  } catch (e) {
    console.error("Failed to Delete User");
    return new NextResponse("Failed to Delete User", {
      status: 500,
    });
  }
}
