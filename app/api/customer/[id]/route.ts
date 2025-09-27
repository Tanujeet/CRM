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
    const membership = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer || customer.isDeleted) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    const teamIds = membership.map((m) => m.teamId);

    if (!teamIds.includes(customer.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }
    return NextResponse.json(customer);
  } catch (err) {
    console.error("Failed to fetch one customer", err);
    return new NextResponse("Failed to fetch customer", { status: 500 });
  }
}


export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
  } catch (err) {
    console.error("Failed to update customer", err);
    return new NextResponse("Failed to update customer", { status: 500 });
  }
}



export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer || customer.isDeleted) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    const membership = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = membership.map((m) => m.teamId);

    if (!teamIds.includes(customer.teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      message: "Customer deleted successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    console.error("Failed to delete customer", err);
    return new NextResponse("Failed to delete customer", { status: 500 });
  }
}