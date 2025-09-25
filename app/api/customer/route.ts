import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const getCustomers = await prisma.customer.findMany({
      where: { team: { memberships: { some: { userId } } }, isDeleted: false },
    });
    return NextResponse.json(getCustomers);
  } catch (err) {
    console.error("Failed to fetch customers", err);
    return new NextResponse("Failed to fetch customers", { status: 500 });
  }
}
