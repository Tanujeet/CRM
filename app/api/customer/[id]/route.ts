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
